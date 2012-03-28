function dumpDBTokenSettings() {
    // returns indented JSON string with token settings with
    // x and y coords updated according to current arrangement
    // for ALL _active_ tokens (amount > 0)
    return JSON.stringify(_.map(GAME.db_view.profiles.tokens, 
                          function(elem) { 
                              var s = elem.settings; 
                              if (elem.elem) { 
                                  s.x = elem.elem.attrs.x; 
                                  s.y = elem.elem.attrs.y;
                              } 
                              return s; }
                         ), false, 2);
}

