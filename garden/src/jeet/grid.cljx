(ns jeet.grid)

(def ^:dynamic *gutter* 3)

(def ^:dynamic *parent-first* false)

(def ^:dynamic *layout-direction* :LTR)

(defn- -get-span
  ([] (-get-span 1))
  ([ratio] (* 100 ratio)))


(defn- -get-column [& {:keys [ratios g]
                       :or {ratios [1] g *gutter*}}]
  (comment
    (let [ratios (if *parent-first* ratios (reverse ratios))]
      (loop [w 100
             [ratio & more] ratios
             ratios []]
        (if ratio
          (recur (+ (* 100 ratio) (- g) (* ratio g))
                 more
                 ))))))

(defn- -get-layout-direction []
  (if (= *layout-direction* :RTL)
    "right"
    "left"))

(defn- kw-str [& args] (keyword (apply str args)))

(defn- jeet-prefixer [name args]
  {(kw-str "-webkit-" name) args
   (kw-str "-ms-" name) args
   (kw-str "-moz-" name) args
   (kw-str "-o-" name) args
   (kw-str name) args})

(defn- opposite-direction [dir]
  (case dir
    "left" "right"
    "right" "left"
    "ltr" "rtl"
    "rtl" "ltr"
    "top" "bottom"
    "bottom" "top"))

(defn cf []
  [[:&
   {:*zoom 1}]
   [:&:before :&:after
    {:content ""
     :display "table"}]
   [:&:after
    {:clear "both"}]])

(defn edit []
  [:* {:background "rgba(#000, 5%)"}])

(defn align
  ([] (align :both))
  ([direction]
   (merge
     {:position "absolute" }
    (jeet-prefixer :transform-style "preserve-3d")
    (cond
     (or (= direction :horizontal) (= direction :h))
     (merge
      {:left "50%"}
      (jeet-prefixer :transform "translateX(-50%)"))

     (or (= direction :verical) (= direction :v))
     (merge
      {:top "50%"}
      (jeet-prefixer :transform "translateY(-50%)"))

     :default
     (merge
      {:top "50%"
       :left "50&"}
      (jeet-prefixer :transform "translate(-50%, -50%)"))))))

(defn center [& {:keys [max-width pad]
                 :or {max-width "1410px" pad 0}}]
  [:&
   (cf)
    {:width "auto"
      :max-width max-width
      :float "none"
      :display "block"
      :margin-right "auto"
      :margin-left "auto"
      :padding-left pad
      :padding-right pad}])


(defn column [ratios & {:keys [offset cycle uncycle gutter]
                        :or {offset 0 cycle 0
                             uncycle 0 gutter :jeet.gutter}}]
  (let [ratios (or ratios 1)
        side (-get-layout-direction)
        column-widths []
        margin-l 0
        margin-r 0]
    [(cf)
     [:&
      {:float "side"
       :display "inline"
       :clear "none"
       :text-align "inherit"
       :padding-left 0
       :padding-right 0
       :width (str (first column-widths) "%")
       (kw-str "margin-" side) (str margin-l "%")
       (kw-str "margin-" (opposite-direction side)) (str margin-r "%")}]]))

(def col column)

(defn stack [& {:keys [pad align]
                :or {pad 0 align false}}]
  (let [side (-get-layout-direction)]
    [[:&
      (merge
       {:display "block"
        :clear "both"
        :float "none"
        :width "100%"
        :margin-left "auto"
        :margin-right "auto"}
       (when align
         {:text-align
          (cond
           (or (= align "center") (= align "c"))
           "center"

           (or (= align "left") (= align "l"))
           "left"

           (or (= align "right") (= align "r"))
           "right")})
       (when (not= 0 pad)
         {:padding-left pad
          :padding-right pad}))]
     [:&:first-child
      {(kw-str "margin-" side) "auto"}]
     [:&:last-child
      {(kw-str "margin-" (opposite-direction side)) "auto"}]]))


(defn unstack []
  (let [side (-get-layout-direction)]
    [[:&
      {:display "inline"
       :clear "both"
       :width "auto"
       :margin-left "auto"
       :margin-right "auto"
       :text-align (if (= *layout-direction* :RTL)
                     "right" "left")}]
     [:&:first-child
      {(kw-str "margin-" side) "0"}]
     [:&:last-child
      {(kw-str "margin-" (opposite-direction side)) "0"}]]))
