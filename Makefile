main: compile_js

compile_js:
	@closure-compiler --js src/dolly.js --js_output_file dolly.min.js
