/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

	urlservidor: 'https://st0rage.org/~thoso/miniwiki.php',
	paginas: {},

	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.init();
	},
	
	
	
	init: function() {
		
		$('#refresh').click(function() {
			app.atualizaPaginas();
		});

		app.atualizaPaginas();
		
	},
    
    abreLink: function(url) {
        if (typeof navigator !== "undefined" && navigator.app) {
            navigator.app.loadUrl(url, {openExternal: true});
        }
        else window.open(url, "_system");
    },
		
	atualizaPaginas: function() {
		$.ui.loadContent("#paginas");
		$.ui.showMask("Buscando páginas...");
		$.get(app.urlservidor + '?fetch=1',function(result) {
			app.paginas = $.parseJSON(result);
			app.listaPaginas();
			$.ui.hideMask();
		});
	},
	
	listaPaginas: function() {
        $('#listapaginas').html('');
        $.each(app.paginas,function(index,value) {
            $('<li></li>').html('<a href="#" onclick="app.abrePagina(' + "'" + value.arquivo + "'" + ')">' + value.arquivo + '</a>').appendTo('#listapaginas');
        });
	},
    
    abrePagina: function(arquivo) {
        $('#wiki').html('');
        $.ui.loadContent("#wiki");
        $.ui.showMask("Carregando conteúdo...");
        $.get(app.urlservidor + '?arquivo=' + arquivo,function(result) {
			$('<div></div>').attr('id','#temp').html(result).appendTo('#wiki');
            var conteudo = $('#conteudo').html();
            $('#wiki').html(conteudo);
            $('#wiki a').each(function () {
                var link = $(this).attr('href');
                $(this).attr('href','#');
                if (link.substr(0,9) == '?arquivo=') $(this).attr('onclick',"app.abrePagina('" + link.substr(9) + "')");
                else $(this).attr('onclick',"app.abreLink('" + link + "')");
            });
			$.ui.hideMask();
		});
    }

	
};
