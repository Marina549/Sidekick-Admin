import { USERS, ago } from '../data';
import { useAdmin } from '../store';
import { ImgIcon } from './Icon';
import { asset } from '../asset';

export function Header() {
  const { s, me, now, set, go, openReview, editEntity } = useAdmin();
  // Approvers get review requests; a submitter gets "changes requested" on their own entities.
  const notifs = s.notifications.filter(n => n.to === me.id || (n.to === 'approvers' && me.canApprove));
  const unread = notifs.filter(n => !n.read).length;
  const showDot = unread > 0;
  const open = (n: (typeof notifs)[number]) => {
    const e = s.entities.find(x => x.id === n.entityId);
    if (n.kind === 'changes') { if (e) editEntity(e); } else openReview(n.entityId);
  };
  const quote = (c: string) => '“' + (c.length > 90 ? c.slice(0, 88).trim() + '…' : c) + '”';

  return (
    <header className="sk-header" data-r="header">
      <button
        type="button"
        className="sk-hamburger"
        data-r="hamburger"
        onClick={() => set({ drawerOpen: true, bellOpen: false, userOpen: false })}
        aria-label="Open navigation"
        aria-expanded={s.drawerOpen}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <button type="button" className="sk-header__logo" onClick={() => go('home')} aria-label="SideKick Admin home">
        <img src={asset('assets/sidekick-logo-full.svg')} data-r="logo" alt="" width={181} height={32} style={{ display: 'block' }} />
      </button>
      <div className="sk-header__tools" data-r="hdr-actions">
        <div className="sk-pop" data-pop="bell">
          <button
            type="button"
            className="sk-bell"
            onClick={() => set(st => ({ bellOpen: !st.bellOpen, userOpen: false }))}
            aria-label={showDot ? `Notifications, ${unread} unread` : 'Notifications'}
            aria-haspopup="true"
            aria-expanded={s.bellOpen}
          >
            <ImgIcon src="c/notification_outlined_24-dark.svg" size={24} />
            {showDot && <span aria-hidden="true" className="sk-bell__dot" />}
          </button>
          {s.bellOpen && (
            <div role="dialog" data-r="pop" aria-label="Notifications" className="sk-menu sk-notifs">
              <div className="sk-menu__title">Notifications</div>
              {notifs.length > 0 ? (
                <ul>
                  {notifs.map(n => (
                    <li key={n.id}>
                      <button type="button" className="sk-menu__item" onClick={() => open(n)}>
                        <span aria-hidden="true" style={{ width: 8, height: 8, marginTop: 8, borderRadius: '50%', flexShrink: 0, background: n.read ? 'transparent' : '#B00000' }} />
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 14, lineHeight: '20px', color: '#1F1E1E' }}>
                            {n.kind === 'changes'
                              ? <><strong>{n.by}</strong> requested changes on <strong>{n.entity}</strong></>
                              : <><strong>{n.by}</strong> {n.verb} <strong>{n.entity}</strong> for review</>}
                          </span>
                          {n.kind === 'changes' && n.comment && (
                            <span style={{ fontSize: 14, lineHeight: '20px', color: '#4B4B49', overflowWrap: 'anywhere' }}>{quote(n.comment)}</span>
                          )}
                          <span style={{ fontSize: 12, lineHeight: '16px', color: '#6E6E6D' }}>{n.category} · {ago(n.at, now)}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sk-notifs__empty">{me.canApprove ? 'You’re all caught up.' : 'No notifications yet.'}</p>
              )}
            </div>
          )}
        </div>
        <span aria-hidden="true" className="sk-header__divider" data-r="hdr-sep" />
        <div className="sk-pop" data-pop="user">
          <button
            type="button"
            className="sk-user-btn"
            onClick={() => set(st => ({ userOpen: !st.userOpen, bellOpen: false }))}
            aria-haspopup="menu"
            aria-expanded={s.userOpen}
            aria-label={me.name + ', switch user'}
          >
            <span className="sk-user-btn__name" data-r="user-name">{me.name}</span>
            <span className="sk-avatar-ring">
              <span className="sk-avatar" style={{ width: 40, height: 40, fontSize: 20, lineHeight: '16px' }}>{me.initials}</span>
            </span>
          </button>
          {s.userOpen && (
            <div role="menu" data-r="pop" aria-label="Switch user" className="sk-menu sk-users">
              <div className="sk-menu__title">Switch user</div>
              {Object.values(USERS).map(u => (
                <button key={u.id} type="button" role="menuitemradio" aria-checked={u.id === s.user} className="sk-menu__item" onClick={() => set({ user: u.id, userOpen: false })}>
                  <span className="sk-avatar" style={{ width: 32, height: 32, fontSize: 14 }}>{u.initials}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, lineHeight: '20px', color: '#1F1E1E' }}>{u.name}</span>
                    <span style={{ fontSize: 12, lineHeight: '16px', color: '#6E6E6D' }}>{u.role}</span>
                  </span>
                  {u.id === s.user && <ImgIcon src="c/checkmark_outlined_24-blue.svg" size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
