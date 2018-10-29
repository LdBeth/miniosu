all : js

js : works.lisp
		ccl -l works.lisp

server :
		python -m SimpleHTTPServer
