PFILES = $(patsubst %.pegjs,%.peg.js,$(wildcard *.pegjs))

all: $(PFILES)

%.peg.js: %.pegjs
	npx pegjs -o $@ $<
