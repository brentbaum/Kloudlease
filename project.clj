
(defproject cloudlease "haxx"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [com.novemberain/monger "1.7.0"]
                 [http-kit "2.1.17"]
                 [ring/ring-core "1.2.1"]
                 [ring/ring-json "0.2.0"]
                 [compojure "1.1.6"]
                 [org.clojure/tools.logging "0.2.4"]]
  :main cloudlease.server
  :ring {:handler cloudlease.server/handler})
