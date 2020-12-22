<?php

namespace App\Http\Controllers;

use App\OrderEnt;
use App\Pe;
use App\Ppe;
use App\Size;
use App\Size_Range;
use App\sizerange_ppe;
use App\Stock;
use App\Supplier;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderEntController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | OrderEnt Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for OrderEnts
    |
    */

    /**
     * Marks a Order as ordered
     *
     * @return response
     */
    public function orderCommited($id, Request $request)
    {
        $order = OrderEnt::findOrFail($id);
        if ($order['orderdate'] != null) {
            return response()->json("the order already got ordered", 400);
        }
        if (array_key_exists('orderdate', $request->all()) && $request['orderdate'] != null) {
            $order->orderdate = $request['orderdate'];
        } else {
            $date = date("Y-m-d");
            $order->orderdate = $date;
        }
        $order->state = "ordered";
        $order->save();

        $company = Auth::user()->company;
        $ppes = Ppe::where('order_ID', $order['order_ID'])->get();
        if (count($ppes) != 0) {
            $order['ppes'] = $ppes->values();
        } else {
            $order['ppes'] = array();
        }

        return response()->json($order, 200);
    }

    /**
     * Puts the commited delivery Date for a Order
     *
     * @return response
     */
    public function orderDelivered($id)
    {
        $order = OrderEnt::findOrFail($id);
        if ($order['commitedDeliveryDate'] != null) {
            return response()->json("the order is already delivered", 400);
        }
        $date = date("Y-m-d");
        $order->commitedDeliveryDate = $date;
        $order->state = "delivered";
        $order->save();

        $company = Auth::user()->company;
        $stock = Stock::findOrFail($company['company_ID']);
        $ppes = Ppe::where('order_ID', $order['order_ID'])->get();
        if (count($ppes) != 0) {
            foreach ($ppes as &$ppe) {
                if ($ppe->delivered == false) {
                    $ppe->stock()->associate($stock);
                    $ppe->delivered = true;
                    $ppe->save();
                }
            }
            $order['ppes'] = $ppes->values();
        } else {
            $order['ppes'] = array();
        }
        return response()->json($order, 200);
    }

    /**
     * Creates a Order
     * !commitedDeliveryDate needs to be empty
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        $orderEntRequest = $request->get('orderEnt');
        if ($orderEntRequest == null) {
            return response()->json(['error' => 'no orderEnt object given in request'], 400);
        }
        $validator = Validator::make($orderEntRequest, OrderEnt::$rules);

        $order = new OrderEnt();
        $supplier = new Supplier();
        if ($request->isMethod('put')) {
            if (!$validator->passes()) {
                return response()->json(['error' => 'Could not update Order (not valid)'], 400);
            }

            if (!array_key_exists('order_ID', $orderEntRequest)) {
                return response()->json(['error' => 'Could not update Order, because a order_ID is needed.'], 400);
            }
            $order = OrderEnt::findOrFail($orderEntRequest['order_ID']);
            $suppID = -1;
            $supplierTemp = new Supplier();
            if (array_key_exists('supplier', $orderEntRequest) && array_key_exists('supplier_ID', $orderEntRequest['supplier'])) {
                $supplierTemp = Supplier::findOrFail($orderEntRequest['supplier']['supplier_ID']);
                $suppID = $supplierTemp['supplier_ID'];
            } else if (array_key_exists('supplier_ID', $orderEntRequest)) {
                $supplierTemp = Supplier::findOrFail($orderEntRequest['supplier_ID']);
                $suppID = $supplierTemp['supplier_ID'];
            }
            $supplier = $order->supplier;
            if ($suppID != -1) {
                if ($supplier['supplier_ID'] != $suppID) {
                    $order->supplier()->dissociate();
                    $supplier = $supplierTemp;
                }
            }
        } else if ($request->isMethod('post')) {
            if (!$validator->passes()) {
                return response()->json(['error' => 'Could not create Order (not valid)'], 400);
            }
            if (array_key_exists('commitedDeliveryDate', $orderEntRequest)) {
                return response()->json(['error' => 'Could not create Order, because the commitedDeliveryDate is not allowed in the create Process(usage only in update).'], 400);
            }
            if (!array_key_exists('supplier_ID', $orderEntRequest) || $orderEntRequest['supplier_ID'] == null) {
                return response()->json(['error' => 'Could not create Order, because a supplier_ID is needed.'], 400);
            }
            $supplier = Supplier::findOrFail($orderEntRequest['supplier_ID']);
        } else {
            return response()->json(['error' => 'Could not create Order'], 400);
        }

        if (array_key_exists('orderdate', $orderEntRequest)) {
            $order->orderdate = $orderEntRequest['orderdate'];
        }
        if ($supplier != null) {
            $order->supplier()->associate($supplier);
        }
        if (array_key_exists('expectedDeliveryDate', $orderEntRequest)) {
            $order->expectedDeliveryDate = $orderEntRequest['expectedDeliveryDate'];
        }
        if (array_key_exists('commitedDeliveryDate', $orderEntRequest)) {
            $order->commitedDeliveryDate = $orderEntRequest['commitedDeliveryDate'];
        }
        if (array_key_exists('state', $orderEntRequest)) {
            $order->state = $orderEntRequest['state'];
        }
        $order->save();
        return response()->json($order, 201);
    }

    /**
     * Returns a Order with the given ID
     *
     * @return response
     */
    public function getOne($id)
    {
        $order = OrderEnt::findOrFail($id);
        $supplier = $order->supplier;
        $order['supplier'] = $supplier;

        $ppes = Ppe::where('order_ID', $id)->get();
        if (count($ppes) != 0) {
            foreach ($ppes as &$ppe) {
                $ppe['pe'] = Pe::findOrFail($ppe['pe_ID']);

                $sizerKeys = sizerange_ppe::where('sn', $ppe['sn'])->get()->values();
                $sizeranges = array();
                if (count($sizerKeys) != 0) {
                    foreach ($sizerKeys as $key) {
                        $range = array();
                        $range = Size_Range::findOrFail($key['sizer_ID']);

                        $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get()->values();
                        $sizeranges[] = $range;
                    }
                }
                $ppe['size_ranges'] = $sizeranges;
            }
        }
        $order['ppes'] = $ppes->values();
        return response()->json($order, 200);
    }

    /**
     * Returns all Orders of a Supplier
     *
     * @return response
     */
    public function getAllSupp($id)
    {
        $orders = OrderEnt::where('supplier_ID', $id)->get();
        if (count($orders) != 0) {
            foreach ($orders as &$order) {
                $order['supplier'] = $order->supplier;
                $ppes = Ppe::where('order_ID', $order['order_ID'])->get();

                if (count($ppes) != 0) {
                    foreach ($ppes as &$ppe) {
                        $ppe['pe'] = Pe::findOrFail($ppe['pe_ID']);
                        $sizerKeys = sizerange_ppe::where('sn', $ppe['sn'])->get()->values();
                        $sizeranges = array();
                        if (count($sizerKeys) != 0) {
                            foreach ($sizerKeys as $key) {
                                $range = array();
                                $range = Size_Range::findOrFail($key['sizer_ID']);

                                $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get()->values();
                                $sizeranges[] = $range;
                            }
                        }
                        $ppe['size_ranges'] = $sizeranges;
                    }
                }
                $order['ppes'] = $ppes->values();
            }
            $orders = $orders->toArray();
            usort($orders, function ($a, $b) {
                return $a['order_ID'] < $b['order_ID'];
            });
        }
        return response()->json($orders, 201);
    }

    /**
     * Returns all Orders of a Company
     *
     * @return response
     */
    public function getAll()
    {
        $company = Auth::user()->company;

        $suppliers = Supplier::where('company_ID', $company['company_ID'])->get();
        if (count($suppliers) == 0) {
            return response()->json(array(), 201);
        }
        $allOrders = array();
        foreach ($suppliers as &$supplier) {
            $orders = OrderEnt::where('supplier_ID', $supplier['supplier_ID'])->get();
            if (count($orders) != 0) {
                foreach ($orders as &$order) {
                    $order['supplier'] = $order->supplier;
                    $ppes = Ppe::where('order_ID', $order['order_ID'])->get();

                    if (count($ppes) != 0) {
                        foreach ($ppes as &$ppe) {
                            $ppe['pe'] = Pe::findOrFail($ppe['pe_ID']);

                            $sizerKeys = sizerange_ppe::where('sn', $ppe['sn'])->get()->values();
                            $sizeranges = array();
                            if (count($sizerKeys) != 0) {
                                foreach ($sizerKeys as $key) {
                                    $range = array();
                                    $range = Size_Range::findOrFail($key['sizer_ID']);

                                    $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get()->values();
                                    $sizeranges[] = $range;
                                }
                            }
                            $ppe['size_ranges'] = $sizeranges;
                        }
                    }
                    $order['ppes'] = $ppes->values();
                    $allOrders[] = $order;
                }
            }
        }
        if (count($allOrders) == 0) {
            return response()->json($allOrders, 201);
        }
        $allOrders = $allOrders;
        usort($allOrders, function ($a, $b) {
            return $a['order_ID'] < $b['order_ID'];
        });
        return response()->json($allOrders, 201);
    }

    /**
     * Deletes a Order with the given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $order = OrderEnt::findOrFail($id);
        $ppes = Ppe::where('order_ID', $id)->get();
        if (count($ppes) != 0) {
            foreach ($ppes as &$ppe) {
                if ($order['commitedDeliveryDate'] != null) {
                    $ppe->orderent()->dissociate();
                    $ppe->save();
                } else {
                    $ppe->delete();
                }
            }
        }
        $order->delete();
        return response()->json(['success' => 'Order deleted'], 201);
    }

    /**
     * Deletes all Orders of the Company
     *
     * @return response
     */
    public function deleteAll()
    {
        $company = Auth::user()->company;

        $suppliers = Supplier::where('company_ID', $company['company_ID'])->get();
        if (count($suppliers) == 0) {
            return response()->json(['success' => 'Keine Bestellungen vorhanden'], 201);
        }
        foreach ($suppliers as &$supplier) {
            $orders = OrderEnt::where('supplier_ID', $supplier['supplier_ID'])->get();
            if (count($orders) != 0) {
                foreach ($orders as &$order) {
                    $ppes = Ppe::where('order_ID', $order['order_ID'])->get();
                    if (count($ppes) != 0) {
                        foreach ($ppes as &$ppe) {
                            if ($order['commitedDeliveryDate'] != null) {
                                $ppe->orderent()->dissociate();
                                $ppe->save();
                            } else {
                                $ppe->delete();
                            }
                        }
                    }
                    $order->delete();
                }
            }
        }
        return response()->json(['success' => 'Orders deleted'], 201);
    }
}
