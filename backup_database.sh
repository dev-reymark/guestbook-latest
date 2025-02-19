#!/bin/bash

# Navigate to the Laravel project directory
cd /var/www/guestbook-latest

# Run the Laravel backup command
#php artisan db:backup

#mysqldump --defaults-extra-file=/home/phmladscwebserver/.my.cnf -h localhost guestbookdb > /var/www/guestbook-latest/storage/app/db-backups/backup-$(date +%F_%H-%M-%S).sql
mysqldump -u guestbook -p'p@$$w0rd' -h 127.0.0.1 guestbookdb > /var/www/guestbook-latest/storage/app/db-backups/backup-$(date +%F_%H-%M-%S).sql
