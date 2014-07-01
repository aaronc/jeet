(defproject jeet "0.1.0-SNAPSHOT"
  :description "Jeet grid system for Clojure(script)'s Garden CSS"
  :url "https://jeet.gs"
  :license {:name "MIT License"
            :url "https://raw.githubusercontent.com/mojotech/jeet/master/LICENSE"}
  :dependencies [[org.clojure/clojure "1.6.0"]]
  :cljx {:builds [{:source-paths ["src"]
                 :output-path "target/classes"
                 :rules :clj}

                {:source-paths ["src"]
                 :output-path "target/classes"
                 :rules :cljs}]}
  :hooks [cljx.hooks]
  :profiles
  {:dev
   {:plugins
    [[com.keminglabs/cljx "0.4.0"]]}})
