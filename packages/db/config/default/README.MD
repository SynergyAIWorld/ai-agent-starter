## Install PostgreSQL Apt Repository

https://www.postgresql.org/download/linux/debian/

## Copy Main config

_mod config primary_conninfo_

```
CREATE ROLE your_replication_user WITH REPLICATION LOGIN ENCRYPTED PASSWORD 'your_password';
mkdir archive
restart main node
```

## pg_basebackup

```
sudo pg_basebackup -h 172.31.35.116 -p 55432 -D /opt/dockge/stacks/db-postgres-slave/data-transfer -U replica -P --wal-method=stream
sudo rm -rf postgres-data
touch data-transfer/standby.signal
sudo mv data-transfer postgres-data
```
