import style from "../styles/Banner.module.css";

const Banner = () => {
    return (
        <>
            <div className={style.mainContainer}>
                <div className={style.promoBanner}>
          <span className={style.text}>
            Скидка 500 ₽ на первый заказ от 1500 ₽
          </span>
                    <button className={style.deliveryButton}>ДОСТАВКА</button>
                </div>
            </div>
        </>
    );
}

export default Banner;