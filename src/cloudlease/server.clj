(ns cloudlease.server
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :refer [resources]]
            [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
            [org.httpkit.server :refer [run-server close]]
            [ring.util.response :refer [response file-response resource-response]]))

(defn file-upload [req]
  (println (req :body))
  (response "Hey, thanks man"))

(defroutes handler
  (GET "/" [] (file-response "/index.html" {:root "resources/public"}))
  (POST "/upload" [] file-upload)
  (resources "/"))

(defn logging [chain] (fn [req]
                        (println req)
                        (chain req)))

(def app (-> handler logging wrap-json-body wrap-json-response))

(defn -main [& args] 
  (run-server app {:port 8080}))
