  start_game();
  if (!tick_started) {
    setInterval(tick, 300);
    tick_started = true;
  }
})();

