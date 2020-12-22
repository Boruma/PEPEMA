<?php
namespace App\Http\Middleware;
use Closure;
class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $response->header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type,  Authorization, X-Auth-Token, Access-Control-Allow-Headers, Accept, X-Requested-With,  Access-Control-Request-Method, Access-Control-Request-Headers');
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Credentials', 'true');
        return $response;
    }
}
