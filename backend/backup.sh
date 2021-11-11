docker exec fablabsch_db_1 sh -c "pg_dump --username=fablabsch fablabsch > /tmp/db.sql"
docker cp fablabsch_db_1:/tmp/db.sql ./sql/db.sql