.PHONY: gh-pages

gh-pages:
	git checkout gh-pages
	git rebase master
	./node_modules/.bin/browserify demo/demo.js > demo/demo.bundle.js
	git add demo/demo.bundle.js
	git commit -am "Rebuild demo"
	git push origin gh-pages
	git checkout master
