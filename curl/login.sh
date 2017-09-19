curl  \
  --header "RETS-Version: RETS/1.7.2" \
  --digest  \
  --user "RTESTB:H06W@4t5"  \
  --output tmp/login.xml  \
  --dump-header tmp/headers.txt \
  --cookie-jar tmp/cookies.txt  \
  --show-error  \
  --verbose  \
  "http://fmlsrets.mlsmatrix.com/rets/login.ashx"
