import { Outlet } from 'react-router';
const { platform, themeParams: theme } = window.Telegram.WebApp;
const background = theme.bg_color;

export default ({ children, align = 'flex-start' }) => {

  return (
    <div style={{
      background: background || '#000', // закоментить, тянется автоматом
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: align,
      gap: '12px',
      width: '100wh',
      height: '100vh',
      padding: '12px',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', 
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::WebkitScrollbar': {
        display: 'none',
      },
    }}>
      <Outlet />
      {children}
    </div>
  )
};
