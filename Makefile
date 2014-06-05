gh-pages:
	git checkout gh-pages
	git rebase master
	./node_modules/bin/browserify demo/demo.js > demo/demo.bundle.js
	git checkout master
