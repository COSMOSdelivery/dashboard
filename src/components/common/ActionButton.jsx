import PropTypes from 'prop-types';

const ActionButton = ({ onClick, icon: Icon, label, color = 'bg-blue-600', disabled = false, ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${color} hover:${color.replace('600', '700')} ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 transition-all'}`}
    aria-label={ariaLabel}
  >
    <Icon size={18} />
    {label}
  </button>
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
};

export default ActionButton;