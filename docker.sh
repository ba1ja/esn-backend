docker build . -t dev/esn-backend
wait
docker save -o esn-backend-1.0.0-SNAPSHOT.tar dev/esn-backend:latest
wait
docker load -i esn-backend-1.0.0-SNAPSHOT.tar
wait
docker container stop esn-backend
wait
docker container rm esn-backend
wait
docker run -d -p 8080:8080 --restart always --name esn-backend --log-opt max-size=10m --log-opt max-file=3 dev/esn-backend