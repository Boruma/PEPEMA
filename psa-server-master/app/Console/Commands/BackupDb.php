<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackupDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup for the Database';

    protected $process;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $today = today()->format('Y-m-d');
        
        $this->process = new Process(sprintf(
            'mysqldump --protocol=socket -S /opt/lampp/var/mysql/mysql.sock -u %s -p%s %s > %s',
            config('database.connections.mysql.username'),
            //config('database.connections.mysql.password'),
            config('database.connections.mysql.database'),
            storage_path('backups/backup.sql')
        ));
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try{
            $this->process->mustRun();
            $this->info('Backup successful');
        } catch (ProcessFailedException $exception) {
            echo $exception->getMessage();
        }
    }
}
