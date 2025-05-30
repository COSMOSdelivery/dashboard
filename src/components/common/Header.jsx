import PropTypes from "prop-types";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Header = ({ title, notifications, removeNotification }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <button
          onClick={handleBackClick}
          className="mr-4 bg-white hover:bg-gray-200 p-2 rounded-full"
          title="Retour"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-black-700">{title}</h1>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["success", "error", "info", "warning"]).isRequired,
    })
  ),
  removeNotification: PropTypes.func.isRequired,
};

Header.defaultProps = {
  notifications: [], // Valeur par défaut pour notifications
};

export default Header;