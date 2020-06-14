import React from "react"
import {
    // FaLinkedin,
    FaGithubSquare,
    // FaStackOverflow,
    // FaFreeCodeCamp,
    FaTwitterSquare,
    FaMedium
} from "react-icons/fa"


const SocialLinks = ({ contacts }) => {
    return (
        <div className="social-links float-right mr-4">
            {/* <a className="text-primary ml-4"
                href={contacts.linkedin}>
                <span title="Linked In">
                    <FaLinkedin size={40} style={{ color: "primary" }} />
                </span>
            </a> */}
            <a className="text-light ml-4"
                href={contacts.github}>
                <span title="GitHub">
                    <FaGithubSquare size={40} style={{ color: "light" }} />
                </span>
            </a>
            {/* <a className="text-info"
                href={contacts.note}>
                <span title="Note">
                    <FaTwitterSquare size={40} style={{ color: "info" }} />
                </span>
            </a> */}
            <a className="text-light"
                href={contacts.medium}>
                <span title="Medium">
                    <FaMedium size={40} style={{ color: "info" }} />
                </span>
            </a>
            <a className="text-info"
                href={contacts.twitter}>
                <span title="Twitter">
                    <FaTwitterSquare size={40} style={{ color: "info" }} />
                </span>
            </a>
        </div>
    )
}

export default SocialLinks