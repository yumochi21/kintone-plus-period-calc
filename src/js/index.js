jQuery.noConflict();

(function ($, PLUGIN_ID) {
  'use strict';

  var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (!CONFIG) {
    return false;
  }

  var CONFIG_STARTDAY = CONFIG.startday;
  var CONFIG_ENDDAY = CONFIG.endday;
  var CONFIG_PERIODTABLE = CONFIG.periodtable;
  var CONFIG_PERIODYEAR = CONFIG.periodyear;
  var CONFIG_PERIODMONTH = CONFIG.periodmonth;

  var calcYear = function(startday, endday) {
    var start = moment(startday);
    var end = moment(endday);

    var year = end.diff(start, 'years');

    return year;
  };

  var calcMonth = function(startday, endday) {
    var start = moment(startday);
    var end = moment(endday);

    var months = end.diff(start, 'months');

    return months % 12;
  };

  var events = [
    'app.record.create.change.' + CONFIG_STARTDAY,
    'app.record.edit.change.' + CONFIG_STARTDAY,
    'app.record.index.edit.change.' + CONFIG_STARTDAY,
    'app.record.create.change.' + CONFIG_ENDDAY,
    'app.record.edit.change.' + CONFIG_ENDDAY,
    'app.record.index.edit.change.' + CONFIG_ENDDAY
  ];

  if (CONFIG_PERIODTABLE !== '') {
    events.push('app.record.create.change.' + CONFIG_PERIODTABLE);
    events.push('app.record.edit.change.' + CONFIG_PERIODTABLE);
    events.push('app.record.index.edit.change.' + CONFIG_PERIODTABLE);
  }

  kintone.events.on(events, function (event) {

    var startday = null;
    var endday = null;
    
    if (CONFIG_PERIODTABLE !== '') {
      startday = event.changes.row.value[CONFIG_STARTDAY].value;
      endday = event.changes.row.value[CONFIG_ENDDAY].value;
    } else {
      startday = event.record[CONFIG_STARTDAY].value;
      endday = event.record[CONFIG_ENDDAY].value;
    }

    var years = calcYear(startday, endday);

    if (CONFIG_PERIODTABLE !== '') {
      event.changes.row.value[CONFIG_PERIODYEAR].value = years;
    } else {
      event.record[CONFIG_PERIODYEAR].value = years;
    }

    if (CONFIG_PERIODMONTH === '') {
      return event;
    }

    var months = calcMonth(startday, endday);

    if (CONFIG_PERIODTABLE !== '') {
      event.changes.row.value[CONFIG_PERIODMONTH].value = months;
    } else {
      event.record[CONFIG_PERIODMONTH].value = months;
    }

    return event;
  });

})(jQuery, kintone.$PLUGIN_ID);
