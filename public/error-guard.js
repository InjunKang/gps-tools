// Last line of defence for the dropzone. Plain ES5 on purpose: it must run on browsers where the
// bundled script fails to parse. Registered before that script (deferred, earlier in the document),
// so a SyntaxError from it, or any later uncaught error, becomes a visible message.
(function () {
  function show(detail) {
    var zone = document.querySelector('[data-dropzone]');
    if (!zone) return;
    var panes = zone.querySelectorAll('[data-pane]');
    for (var i = 0; i < panes.length; i++) panes[i].hidden = panes[i].getAttribute('data-pane') !== 'error';
    var text = 'Something went wrong. Nothing was uploaded.';
    try {
      text = JSON.parse(zone.getAttribute('data-messages')).errors.unknown || text;
    } catch (e) {}
    zone.querySelector('[data-error]').textContent = text;
    zone.querySelector('[data-error-detail]').textContent = detail;
  }
  window.addEventListener('error', function (event) {
    var where = event.filename ? ' (' + event.filename.split('/').pop() + ':' + event.lineno + ')' : '';
    show((event.message || 'Script error') + where);
  });
  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason;
    show(String(reason && reason.message ? reason.message : reason));
  });
})();
