import style from "../styles/footer.module.css";
import { Link } from "react-router-dom";
import logoFooter from "../assets/logoFooter.png";
import { FaInstagram, FaVk, FaFacebookF, FaOdnoklassniki } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";

function Footer() {

    return (
        <div className={style.footerWrapper}>
            <div className={style.footerContent}>
                <img src={logoFooter} alt="Северяночка" className={style.logoFooter} />

                <nav className={style.navLinks}>
                    <Link to="/about" className={style.link}>О компании</Link>
                    <Link to="/contacts" className={style.link}>Контакты</Link>
                    <Link to="/vacancies" className={style.link}>Вакансии</Link>
                </nav>

                <div className={style.socialLinks}>
                    <FaInstagram  />
                    <FaVk />
                    <FaFacebookF  />
                    <FaOdnoklassniki  />
                </div>

                <div className={style.contactInfo}>
                    <span>
                      8 999 999 99 80   <IoCallOutline />
                    </span>
                    <span className={style.design}>
                        Дизайн <b>ZASOVSKIY</b>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Footer;