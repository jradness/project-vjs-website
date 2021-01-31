import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import { __ } from '../../../redux/models/Lang';
import A3Icon from '../A3Icon';
import A3Link from '../A3Link';
import MainSideBar from '../MainSideBar';
import MainSlideDownNav from '../MainSlideDownNav';
import AccountSearch from './AccountSearch';
import './MainAppBar.scss';
import AccountSettings from '../AccountSettings';
import getUsersName from '../../helpers/getUsersName';
import NotificationCenter from '../NotificationCenter';
import OutsideClicker from '../../hooks/useClickOutside';
import ROUTE from '../../constants/Routes';

export const useThemeToggle = (defaultTheme = 'light') => {
  const THEME_TOGGLE_DELAY = 500;
  const [theme, setTheme] = useState(defaultTheme);
  return () => {
    const activeTheme = (theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.add('color-theme-in-transition');
    setTheme(activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('color-theme-in-transition');
    }, THEME_TOGGLE_DELAY);
  };
};

const MainAppBar = (props) => {
  const {
    toggleLeftNav,
    topNav,
    searchBar,
    toggleTopNav,
    proposalId,
    loadProposal,
    getGroupedServers,
    appBarDrawer,
    leftNav,
    toggleAppBarDrawer,
    photo,
    alertCount,
    toggleAlertInbox,
  } = props;

  const userName = getUsersName();
  const toggleTheme = useThemeToggle();

  const toggle = useCallback(() => {
    if (!appBarDrawer) {
      toggleAppBarDrawer(<AccountSettings />);
    }
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const regex = /(offer\/|proposal\/)(.{17})/gm;
    const match = regex.exec(path);
    // just to be sure that we found propId
    if (match && match[2] && match[2].length === 17) {
      // proposal is always 17 letters;
      const urlPropId = match[2];
      if (urlPropId !== proposalId) {
        loadProposal({ proposalId: urlPropId });
        getGroupedServers({ proposalId: urlPropId });
      }
    }
  }, [window.location.pathname]);

  return (
    <>
      <div className="appBar">
        <button title={__({ id: 'general.main_menu' })} aria-controls="sideMenu" onClick={toggleLeftNav} className="mainNavIcon" aria-haspopup="false">
          <i className="fal fa-bars" />
        </button>
        {(leftNav) ? (
          <OutsideClicker action={toggleLeftNav}>
            <MainSideBar id="slideLeftNav" />
          </OutsideClicker>
        ) : null}
        <span title={__({ id: 'general.a3_home_dashboard' })}>
          <A3Link to={ROUTE.DASHBOARD}>
            <A3Icon />
          </A3Link>
        </span>
        {(searchBar) ? (
          <div className="app-bar-account-search-wrapper">
            <AccountSearch />
          </div>
        ) : null}
        <div className="appBarRightSection">
          <div role="presentation" className="notification-bell-wrapper" onClick={toggleAlertInbox} title={__({ id: 'notification.notifications' })}>
            <i className={cn('fal fa-bell notification-bell', { 'ring-bell': Boolean(alertCount) })} />
            {(alertCount > 0) && <div className={cn('notification-counter', { 'scale-in': Boolean(alertCount) })}>{alertCount}</div>}
          </div>
          <button type="button" aria-controls="slideDownMenu" onClick={toggleTopNav} className="slideDownNavIcon hide" aria-haspopup="false" title={__({ id: 'general.user_tools' })}>
            <i className="far fa-ruler-triangle" />
          </button>
          <div role="button" color="inherit" className="userInfo">
            <span className="nameLocation">
              <div className="userName">{userName}</div>
            </span>
            <span role="presentation" onClick={toggle} className="headerAvatar" title={__({ id: 'general.user_settings' })}>
              <img src={photo} className="user-photo" alt="user profile" />
            </span>
          </div>
          <A3Link to={ROUTE.HELP} className="app-bar-help-link">
            <div id="helpResources" className="helpBox" title={__({ id: 'general.help_section' })}>
              <i className="fas fa-question" />
            </div>
          </A3Link>
        </div>
        {(topNav) ? (<MainSlideDownNav id="topNav" />) : null}
        {!!appBarDrawer && (appBarDrawer)}
        <NotificationCenter />
      </div>
    </>
  );
};

MainAppBar.propTypes = {
  toggleLeftNav: PropTypes.func,
  toggleTopNav: PropTypes.func,
  searchBar: PropTypes.bool,
  proposalId: PropTypes.string,
  loadProposal: PropTypes.func.isRequired,
  getGroupedServers: PropTypes.func.isRequired,
  leftNav: PropTypes.bool,
  topNav: PropTypes.bool,
  appBarDrawer: PropTypes.node,
  toggleAppBarDrawer: PropTypes.func,
  photo: PropTypes.string,
  inboxNotifications: PropTypes.array,
};

MainAppBar.defaultProps = {
  toggleLeftNav: () => {},
  toggleTopNav: () => {},
  searchBar: true,
  proposalId: null,
  leftNav: false,
  topNav: false,
  appBarDrawer: null,
  toggleAppBarDrawer: () => {},
  photo: '',
  inboxNotifications: [],
};

const mapStateToProps = ({
  proposal,
  main,
  admin,
  notification,
  drawers,
  user,
}) => ({
  searchBar: main.get('searchBar'),
  title: main.get('title'),
  proposalId: proposal.get('currentProposalId'),
  isAdminView: admin.get('isAdminView'),
  alertCount: notification.get('inboxNotifications').length,
  topNav: main.get('topNav'),
  leftNav: main.get('leftNav'),
  appBarDrawer: drawers.get('appBarDrawer'),
  photo: user.get('photo'),
});

const mapDispatchToProps = ({
  main: { toggleLeftNav, toggleTopNav },
  proposal: { loadProposal },
  installBase: { getGroupedServers },
  drawers: { toggleAppBarDrawer },
  notification: { setShowNotificationInbox },
}) => ({
  loadProposal,
  getGroupedServers,
  toggleLeftNav,
  toggleTopNav,
  toggleAppBarDrawer,
  toggleAlertInbox: () => setShowNotificationInbox(),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainAppBar);
