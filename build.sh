#!/usr/bin/env bash

##########
VERSION=${1}

# These are the values we want to pass for Version and BuildTime
GITHASH=`git rev-parse HEAD 2>/dev/null`

BUILDAT=`date +%FT%T%z`

# Setup the -ldflags option for go build here, interpolate the variable values
LDFLAGS="-s -w -X github.com/TruthHun/BookStack/utils.GitHash=${GITHASH} -X github.com/TruthHun/BookStack/utils.BuildAt=${BUILDAT} -X github.com/TruthHun/BookStack/utils.Version=${VERSION}"

##########

CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -v -o output/mac/itshujia -ldflags "${LDFLAGS}"
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o output/linux/itshujia -ldflags "${LDFLAGS}"
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -v -o output/windows/itshujia.exe -ldflags "${LDFLAGS}"
upx -f -9 output/mac/itshujia
upx -f -9 output/linux/itshujia
upx -f -9 output/windows/itshujia.exe
