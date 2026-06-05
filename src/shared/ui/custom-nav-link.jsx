import { NavLink } from "react-router-dom";

const CustomNavLink = ({ label, path, color, ...props }) => {
  return (
    <NavLink className="custom-link" to={path} {...props}>
      {label}
    </NavLink>
  );
};

export default CustomNavLink;
