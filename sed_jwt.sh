printf "%s" "JWT_PUBLIC_KEY=\"" >> .env
cat keys/public.pem | sed -z -e 's/\n/\\n/g' >> .env
printf "%s\n" "\"" >> .env
printf "%s" "JWT_PRIVATE_KEY=\"" >> .env
cat keys/private.pem | sed -z -e 's/\n/\\n/g' >> .env
printf "%s\n" "\"" >> .env
