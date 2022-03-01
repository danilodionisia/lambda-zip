aws --endpoint-url=http://localhost:4566 delete-function --function-name lambda_zip

sleep 2

zip -R lambda_zip .

sleep 2

aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name lamdba_zip \
    --zip-file fileb://lambda_zip.zip \
    --handler index.handler \
    --timeout 5 \
    --runtime nodejs14.x

sleep 2

aws lambda invoke --function-name publishNewBark --payload file://payload.json output.txt