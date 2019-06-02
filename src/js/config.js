jQuery.noConflict();

(function ($, PLUGIN_ID) {
  'use strict';

  // プラグインIDを取得
  var KEY = PLUGIN_ID;

  // プラグインの設定を取得
  var CONF = kintone.plugin.app.getConfig(KEY);

  /**
   * HTMLで使用できない文字のエスケープ処理を行う
   * @param {string} htmlstr 文字列
   * @returns {string} エスケープ済み文字列
   */
  var escapeHtml = function(htmlstr) {
    if (htmlstr === undefined) {
      return '';
    }
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * ドロップダウンの設定を行う
   */
  var setDropdown = function() {

    KintoneConfigHelper.getFields(['DATE', 'SUBTABLE', 'NUMBER']).then(function (resp) {
      
      for (var i = 0; i < resp.length; i++) {
        var prop = resp[i];
        var $option = $('<option>');

        $option.attr('value', escapeHtml(prop.code));
        $option.text(escapeHtml(prop.label) + '(' + prop.code + ')');

        $('#startday').append($option.clone());
        $('#endday').append($option.clone());
        $('#periodtable').append($option.clone());
        $('#periodyear').append($option.clone());
        $('#periodmonth').append($option.clone());
      }

      // 初期値を設定する
      $('#startday').val(CONF.startday);
      $('#endday').val(CONF.endday);
      $('#periodtable').val(CONF.periodtable);
      $('#periodyear').val(CONF.periodyear);
      $('#periodmonth').val(CONF.periodmonth);
    }).catch(function (err) {
      alert(err.message);
    });
  }

  /**
   * 画面読み込み後に実行する処理
   */
  $(document).ready(function () {

    if (CONF) {
      setDropdown();
    }

    $('#plugin-submit').click(function () {
      
      var config = [];

      var startday = $('#startday').val();
      var endday = $('#endday').val();
      var periodtable = $('#periodtable').val();
      var periodyear = $('#periodyear').val();
      var periodmonth = $('#periodmonth').val();

      if (startday === '' || endday === '' || periodyear === '') {
        alert('必須項目が入力されていません');
        return;
      }

      config.startday = startday;
      config.endday = endday;
      config.periodtable = periodtable;
      config.periodyear = periodyear;
      config.periodmonth = periodmonth;

      kintone.plugin.app.setConfig(config);
    });

    $('#plugin-cancel').click(function () {
      history.back();
    });
  });

})(jQuery, kintone.$PLUGIN_ID);
