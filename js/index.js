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

	urlservidor: 'https://st0rage.org/~thoso/links.php?fetch=1',
	links: {},

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
			app.atualizaLinks();
		});
		$('#addlink').submit(function(event) {
			event.preventDefault();
			app.adicionaLink();
		});

		app.atualizaLinks();
		
	},
    
    abreLink: function(url) {
        if (typeof navigator !== "undefined" && navigator.app) {
            navigator.app.loadUrl(url, {openExternal: true});
        }
        else window.open(url, "_system");
    },
		
	atualizaLinks: function() {
		$.ui.loadContent("#links");
		$.ui.showMask("Buscando links...");
		$.get(app.urlservidor,function(result) {
			app.links = $.parseJSON(result);
			$('#ordenar').removeClass('up').addClass('down');
			app.mostraLinks();
			$.ui.hideMask();
		});
	},
	
	mostraLinks: function() {
		 $('#listaurls').html('');
			$.each(app.links,function(index,value) {
				$('<li></li>').html('<a href="#" onclick="app.abreLink(' + "'" + value.url + "'" + ')">' + value.desc + '<small>' + value.url + '</small></a>').appendTo('#listaurls');
			});
	},
	
	adicionaLink:function() {
		if ($('#addlink input[name=url]').val() == '') { $.ui.popup('Preencha a URL'); return; }
		$.ui.showMask("Adicionando...");
		$.post(app.urlservidor,$('#addlink').serialize(),function() {
			$.ui.hideMask();
			$.ui.popup('Link Adicionado!');
			app.atualizaLinks();
		});
		$('#addlink input[name=desc]').val('');
		$('#addlink input[name=url]').val('');
	},
	
	ordenaLista:function() {
		if ($('#ordenar').hasClass('down')) $('#ordenar').removeClass('down').addClass('up');
		else if ($('#ordenar').hasClass('up')) $('#ordenar').removeClass('up').addClass('down');
		$.ui.showMask("Ordenando...");
		app.links.reverse();
		app.mostraLinks();
		$.ui.hideMask();
	}

	
};
