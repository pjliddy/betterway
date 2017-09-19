curl  \
  --user-agent "MyCurlClient/1.0" \
  --header "RETS-Version: RETS/1.7.2" \
  --digest \
  --user "RTESTB:H06W@4t5" \
  --output tmp/metadata.xml \
  --dump-header tmp/headers.txt \
  --cookie-jar tmp/cookies.txt  \
  --cookie tmp/cookies.txt  \
  --data  Type=METADATA-SYSTEM  \
  --data  ID=*  \
  --data  Format=COMPACT  \
  --show-error \
  --verbose \
  "http://fmlsrets.mlsmatrix.com/Rets/GetMetadata.ashx"
