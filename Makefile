.PHONY: gh-pages

gh-pages:
	git checkout gh-pages
	git rebase master
	./node_modules/.bin/browserify demo/demo.js > demo/demo.bundle.js
	git add demo/demo.bundle.js
	git diff --quiet --exit-code --cached || git commit -m 'Rebuild demo'
	git push origin gh-pages -f
	git checkout master
