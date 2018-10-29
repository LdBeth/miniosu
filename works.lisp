(ql:quickload :parenscript)

(defpackage playground
  (:use #:ps #:cl))

(in-package "PLAYGROUND")

;;; Prelude

(defpsmacro defsketch (initvar preload setup &rest draw)
  `(progn
     ,@(loop for pairs in initvar
             collect (if (atom pairs)
                         `(defvar ,pairs)
                         `(defvar ,(car pairs)
                            ,(second pairs))))
     (defun preload ()
       ,@preload
       undefined)
     (defun setup ()
       ,@setup
       undefined)
     (defun draw ()
       ,@draw
       undefined)))

(defmacro make-js (path &rest body)
  `(with-open-file (out ,path :direction :output
                              :if-does-not-exist :create
                              :if-exists :supersede)
     (format out "/* Generated from Parenscript. */~%")
     (ps-to-stream out ,@body)))

(defmacro make-sketch (path &rest body)
  `(make-js ,path (defsketch ()
                      ((create-canvas 400 400))
                    ,@body)))

(make-js #P"sketch.js"
         (define-symbol-macro *aradi* 20)
         (define-symbol-macro *ar*   0.1)
         (define-symbol-macro *radi*  40)
         (define-symbol-macro *tolerance* 4)
         (defun get-color (c)
           (with-slots (pointer candidate) c
             (aref candidate pointer)))

         (defun new-circle ()
           (create x ((@ beatmap x shift))
                   y ((@ beatmap y shift))
                   r *radi* #| radius |#
                   c (get-color colormap)))

         (defun draw-circle (o)
           (with-slots (x y r c) o
             (fill c)
             (no-stroke)
             (ellipse x y (- *radi* 4))
             (stroke c)
             (no-fill)
             (ellipse x y *radi*)
             (ellipse x y (+ *radi* r))
             (decf r *ar* #| AR|#))
           undefined)

         (defun draw-fail (o)
           (with-slots (x y) o
             (stroke "red")
             (line (+ x 8) (+ y 8) (- x 8) (- y 8))
             (line (+ x 8) (- y 8) (- x 8) (+ y 8)))
           undefined)

         (defun draw-success (o)
           (with-slots (x y) o
             (stroke "green")
             (ellipse x y 15)))

         (defun loss (c)
           (with-slots (x y) c
             ((@ fails push) (create x x y y)))
           undefined)

         (defun key-pressed ()
           (if (< (abs (@ circles 0 r)) *tolerance*)
               (progn
                 ((@ sounds 1 play))
                 (with-slots (x y) ((@ circles pop))
                   ((@ success push) (create x x y y))))
               ((@ sounds 2 play)))
           undefined)

         (defsketch
             ((status t)
              (sounds '())

              ;; Circle sink
              (circles '())
              (fails '())
              (success '())
              ;; Beatmap
              (beatmap (create
                        x '(215 124 344)
                        y '(33  144 36)
                        time '(4 5 12)))

              ;; Color
              (colormap (create
                         candidate '()
                         pointer 0)))

             ((sound-formats "mp3")
              (dolist (file '("slidertick"
                              "hitnormal"
                              "hitwhistle"))
                (let ((sound (load-sound (+ "normal-" file ".mp3"))))
                  ((@ sounds push) sound))))

           ((create-canvas 400 400)
            (text-size 100)
            (dolist (x (list (color 314 56 95) (color 314 56 44)))
              ((@ colormap candidate push) x))
            ((@ circles push) (new-circle)))

           (background 255 20)
           (color-mode *hsb* 360 100 100)

           #|
           (when (= (length time-line) 0)
           (#|halt|#))
           ;; Main loop
           (when (/= 0 (aref time-line 0))
           (funcall (@ time-line shift))
           ((@ circles push) (new-circle)))
           |#

           ((@ fails map)
            draw-fail)
           ((@ success map)
            draw-success)
           (dolist (o circles)
             (draw-circle o))
           (when (> (@ circles length) 0)
             ;; Discard expired
             (when (< (@ circles 0 r) (- *tolerance*)) ; Make some offsect
               (loss (funcall (@ circles shift)))))

           ;; Ref bubbles
           ))

(ccl:quit)
