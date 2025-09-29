export default ({ children }) => {
  return (
    <div
      style={{
        //paddingLeft: '12px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch', 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::WebkitScrollbar': {
          display: 'none',
        },
      }}
    >
      {children}
    </div>
  )
};
