import React, { useEffect } from "react";
import styles from '../styles/MapComponent.module.css'

declare global {
    interface Window {
        ymaps?: any;
    }
}

const MapComponent: React.FC = () => {
    useEffect(() => {
        const loadYandexMap = () => {
            if (window.ymaps) {
                window.ymaps.ready(initMap);
            }
        };

        const initMap = () => {
            const map = new window.ymaps.Map("map", {
                center: [59.889344, 30.318075], 
                zoom: 16,
                controls: ["zoomControl", "fullscreenControl"],
            });

            const placemark = new window.ymaps.Placemark(
                [59.889344, 30.318075],
                {
                    balloonContentHeader: "<strong>Наш офис</strong>",
                    balloonContentBody: "Санкт-Петербург, переулок Каховского, 10",
                    hintContent: "Кликните, чтобы узнать подробнее",
                },
                {
                    preset: "islands#redDotIcon",
                }
            );

            map.geoObjects.add(placemark);
        };

        if (!document.getElementById("yandex-maps-script")) {
            const script = document.createElement("script");
            script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
            script.type = "text/javascript";
            script.id = "yandex-maps-script";
            script.onload = loadYandexMap;
            document.head.appendChild(script);
        } else {
            loadYandexMap();
        }
    }, []);

    return (
        <div className={styles.mapContainer}>
            <h2 className={styles.title}>Наш адрес</h2>
            <p className={styles.address}>Санкт-Петербург, переулок Каховского, 10</p>
            <div id="map" className={styles.map}></div>

            <div className={styles.buttons}>
                <a
                    href="https://yandex.ru/maps/?rtext=~59.889344,30.318075"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.routeButton}
                >
                    Построить маршрут
                </a>
                <a
                    href="https://taxi.yandex.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.taxiButton}
                >
                    Вызвать такси
                </a>
            </div>
        </div>
    );
};

export default MapComponent;


