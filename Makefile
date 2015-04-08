TC = tsc

SRC = $(shell find ts -name "*.ts")
JS = $(SRC:ts/%.ts=public/js/%.js)

BUNDLE = browserify
BUNDLE_FLAGS = 
DIST = urfwin.js

DIST_MIN = urfwin.min.js
MIN = uglifyjs
MIN_FLAGS =

$(JS):$(SRC)
	$(TC) $< --out $@

$(DIST): $(SRC)
	$(BUNDLE) $(BUNDLEFLAGS) --out $@ $^

$(DIST_MIN): $(DIST)
	$(MIN) $(MINFLAGS) $< --out $@

clean:
	rm ./public/js/*.js
