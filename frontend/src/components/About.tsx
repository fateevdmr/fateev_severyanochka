import React, { useCallback } from "react";
import style from "../styles/about.module.css";
import teamImage from "../assets/people.png";

const COMPANY_INFO = {
    YEARS_OF_EXPERIENCE: "20",
    TITLE: "О компании",
    DESCRIPTION: "Мы непрерывно развиваемся и работаем над совершенствованием сервиса, заботимся о наших клиентах, стремимся к лучшему будущему.",
    FOOTER_MESSAGE: "Спасибо за то, что вы с нами. Северяночка, везет всегда!",
} as const;

const INFO_BLOCKS = [
    {
        icon: "✔️",
        title: "Мы занимаемся розничной торговлей",
        highlight: `Более ${COMPANY_INFO.YEARS_OF_EXPERIENCE}  лет.`,
    },
    {
        icon: "✔️",
        title: "Основная миссия компании",
        highlight: "Максимальное качество товаров и услуг по доступной цене.",
    },
    {
        icon: "✔️",
        title: "Отличительная черта нашей сети",
        highlight: "Здоровая и полезная продукция местного производства в наших магазинах.",
    },
] as const;

const About: React.FC = () => {
    const renderInfoBlock = useCallback(({ icon, title, highlight }: typeof INFO_BLOCKS[number]) => (
        <div key={title} className={style.infoBlock}>
            <span className={style.icon}>{icon}</span>
            <p>
                {title}
                <br />
                <b>{highlight}</b>
            </p>
        </div>
    ), []);

    return (
        <div className={style.aboutWrapper}>
            <div className={style.title}>{COMPANY_INFO.TITLE}</div>
            <p className={style.description}>{COMPANY_INFO.DESCRIPTION}</p>
            <div className={style.imageWrapper}>
                <img 
                    src={teamImage} 
                    alt="Команда" 
                    className={style.teamImage}
                    loading="lazy"
                />
            </div>
            <div className={style.infoBlocks}>
                {INFO_BLOCKS.map(renderInfoBlock)}
            </div>
            <div className={style.footerMessage}>
                {COMPANY_INFO.FOOTER_MESSAGE}
            </div>
        </div>
    );
};

export default About;
