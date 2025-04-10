import style from "../styles/SpecialOffers.module.css"

function SpecialOffers() {
    return (
        <div className={style.specialOffersWrapper}>
            <div className={style.specialOffers}>
                <div className={style.text}>Специальные предложения</div>
                <div className={style.cardsContainer}>
                    <div className={style.card}>
                        <div className={style.titleOne}>Оформите карту «Северяночка»</div>
                        <div className={style.titleTwo}>
                            И получайте бонусы при покупке в магазинах и на сайте
                        </div>
                        <div className={style.img}></div>
                    </div>
                    <div className={style.cardOne}>
                        <div className={style.titleOne}>Покупайте акционные товары</div>
                        <div className={style.titleTwo}>
                            И получайте вдвое больше бонусов
                        </div>
                        <div className={style.imgOne}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecialOffers;