<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Validator;

class UsersController extends Controller
{
    
    /*
    |--------------------------------------------------------------------------
    | Users Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for Users
    |
    */

    /**
     * Logout the logged in User
     *
     * @return response
     */
    public function logout()
    {
        $accessToken = Auth::user()->token();
        DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $accessToken->id)
            ->update([
                'revoked' => true
            ]);

        $accessToken->revoke();
        return response()->json(null, 204);
    }

    /**
     * Returns the accessToken of given User
     *
     * @return response
     */
    public function get_oauth_client(Request $request)
    {
        return $this->accessToken->client;
    }

    /**
     * Returns the User
     *
     * @return response
     */
    public function getOne() {
        $user = Auth::user();
        return response()->json($user, 200); 
    }
}
