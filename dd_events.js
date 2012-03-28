/* event handlers */

update_bar_value = function(bar_id, inc) {
    var bar = this._bars.bars[bar_id];
    bar.update_value(inc);
}

full_ap = function() {
    var bar = this.paper._bars.bars['ap_bar'];
    var old_max = bar.maximum;
    bar.maximum = old_max + 2;
    bar.set_value(old_max);
}

fixed_to_front = function() {
    this.paper._fixed.toFront();
}


protests = function(amount) {
    protest_popup(this, amount);
}

levelup = function(level) {
    if (level==5) {
      this.game.start_levelup(level);
    }
}
