var display = {}
Blockbench.display_settings = display
var ground_animation = false;
var ground_timer = 0
var display_slot;
var display_clipboard;

class refModel {
	constructor(id) {
		this.model = new THREE.Object3D();
		this.name = tl('display.reference.'+id);
		this.id = id;
		this.icon = id;
		this.initialized = false;

		switch (id) {
			case 'player':
				this.onload = function() {
					if (display_slot === 'thirdperson_righthand') {
						setDisplayArea(-5.7, 7.5, -6, -90, 22.5, 90, 1, 1, 1)
					} else if (display_slot === 'thirdperson_lefthand') {
						setDisplayArea(-5.7, 7.5, 6, -90, 22.5, 90, 1, 1, 1)
					} else if (display_slot === 'head') {
						setDisplayArea(0, 22, 0, 0, 90, 0, 0.625, 0.625, 0.625)
					}
				}
				break;
			case 'armor_stand':
				this.onload = function() {
					if (display_slot === 'thirdperson_righthand') {
						setDisplayArea(-2, 6, -6, -90, 0, 90, 1, 1, 1)
					} else if (display_slot === 'thirdperson_lefthand') {
						setDisplayArea(-2, 6, 6, -90, 0, 90, 1, 1, 1)
					} else if (display_slot === 'head') {
						setDisplayArea(0, 21, 0, 0, 90, 0, 0.625, 0.625, 0.625)
					}
				}
				break;
			case 'armor_stand_small':
				this.onload = function() {
					if (display_slot === 'thirdperson_righthand') {
						setDisplayArea(-1, 0, -3, -90, 0, 90, 0.5, 0.5, 0.5)
					} else if (display_slot === 'thirdperson_lefthand') {
						setDisplayArea(-1, 0, 3, -90, 0, 90, 0.5, 0.5, 0.5)
					} else if (display_slot === 'head') {
						setDisplayArea(0, 8.5, 0, 0, 90, 0, 0.4635, 0.4635, 0.4635)
					}
				}
				break;
			case 'zombie':
				this.onload = function() {
					if (display_slot === 'thirdperson_righthand') {
						setDisplayArea(-10, 18, -6, -90, 90, 90, 1, 1, 1)
					} else if (display_slot === 'thirdperson_lefthand') {
						setDisplayArea(-10, 18, 6, -90, 90, 90, 1, 1, 1)
					} else if (display_slot === 'head') {
						setDisplayArea(0, 22, 0, 0, 90, 0, 0.625, 0.625, 0.625)
					}
				}
				break;
			case 'baby_zombie':
				this.onload = function() {
					if (display_slot === 'thirdperson_righthand') {
						setDisplayArea(-5, 6, -3, -90, 90, 90, 0.5, 0.5, 0.5)
					} else if (display_slot === 'thirdperson_lefthand') {
						setDisplayArea(-5, 6, 3, -90, 90, 90, 0.5, 0.5, 0.5)
					} else if (display_slot === 'head') {
						setDisplayArea(0, 8.5, 0, 0, 90, 0, 0.4635, 0.4635, 0.4635)
					}
				}
				break;
			case 'monitor':
				this.onload = function() {
					if (display_slot === 'firstperson_righthand') {
						setDisplayArea(-20.8, -8.4, 9, 0, 270, 0, 1,1,1)
					} else if (display_slot === 'firstperson_lefthand') {
						setDisplayArea(-20.5, -8.4, -9, 0, 270, 0, 1,1,1)
					}
				}
				break;
			case 'bow':
				this.onload = function() {
					if (display_slot === 'firstperson_righthand') {
						setDisplayArea(-24.7, -5.6, 5.4, 64, -115, 55, 1,1,1)
					} else if (display_slot === 'firstperson_lefthand') {
						setDisplayArea(-24.7, -5.6, -5.4, -64, -65, -55, 1,1,1)
					}
				}
				break;
		}
	}
	buildModel(things, texture) {
		var scope = this;
		if (texture === 'black') {
			var mat = new THREE.MeshBasicMaterial({color: 0x000000});
		} else {
			var img = new Image();
			img.src = texture;
			var tex = new THREE.Texture(img);
			img.tex = tex;
			img.tex.magFilter = THREE.NearestFilter;
			img.tex.minFilter = THREE.NearestFilter;
			img.onload = function() {
				this.tex.needsUpdate = true;
			}
			img.crossOrigin = '';
			var mat = new THREE.MeshLambertMaterial({color: 0xffffff, map: tex, transparent: true});
		}

		scope.material = mat

		things.forEach(function(s) {
			var mesh = new THREE.Mesh(new THREE.CubeGeometry(s.size[0], s.size[1], s.size[2]), mat )
			mesh.position.set(s.origin[0], s.origin[1], s.origin[2])
			mesh.geometry.translate(-s.origin[0], -s.origin[1], -s.origin[2])
			mesh.geometry.translate(s.pos[0], s.pos[1], s.pos[2])
			if (s.angle) {
				mesh.rotation['z'] = Math.PI / (180 /s.angle)
			}

			for (var face in s) {
				if (s.hasOwnProperty(face) && s[face].uv !== undefined) {
					var fIndex = 0;
					switch(face) {
						case 'north':   fIndex = 10;   break;
						case 'east':	fIndex = 0;	break;
						case 'south':   fIndex = 8;	break;
						case 'west':	fIndex = 2;	break;
						case 'up':	  fIndex = 4;	break;
						case 'down':	fIndex = 6;	break;
					}
					mesh.geometry.faceVertexUvs[0][fIndex] = [ getUVArray(s[face])[0], getUVArray(s[face])[1], getUVArray(s[face])[3] ];
					mesh.geometry.faceVertexUvs[0][fIndex+1] = [ getUVArray(s[face])[1], getUVArray(s[face])[2], getUVArray(s[face])[3] ];
				}
			}
			mesh.geometry.elementsNeedUpdate = true;

			scope.model.add(mesh);
		})
		scope.model.name = name;
		return this;
	}
	load() {
		displayReferenceObjects.clear()
		if (typeof this.onload === 'function') {
			this.onload()
		}
		//3D
		if (!this.initialized) {
			switch (this.id) {
				case 'player': this.buildPlayer(); break;
				case 'zombie': this.buildZombie(); break;
				case 'armor_stand': this.buildArmorStand(); break;
				case 'baby_zombie': this.buildBabyZombie(); break;
				case 'armor_stand_small': this.buildArmorStandSmall(); break;
				case 'monitor': this.buildMonitor(); break;
				case 'bow': this.buildMonitor(); break;
				case 'block': this.buildBlock(); break;
				case 'frame': this.buildFrame(); break;
			}
			this.initialized = true;
		}
		display_scene.add(this.model)
		displayReferenceObjects.active = this;
		
		main_preview.loadBackground()
	}
	buildPlayer() {
		var scope = this;
		var things = [
			{"size": [4, 12, 4], "pos": [0, 12, -6], "origin": [0, 16, 0], "angle": -22.5,
				"north": {"uv": [10, 5, 11, 8], "texture": "#0"},
				"east": {"uv": [13, 5, 14, 8], "texture": "#0"},
				"south": {"uv": [12, 5, 13, 8], "texture": "#0"},
				"west": {"uv": [11, 5, 12, 8], "texture": "#0"},
				"up": { "uv": [11, 4, 12, 5], "texture": "#0", "rotation": 270 },
				"down": { "uv": [12, 5, 13, 4], "texture": "#0", "rotation": 270 }
			},	//Right Arm

			{"size": [4, 12, 4], "pos": [0, 12, 6], "origin": [0, 16, 0], "angle": -22.5,
				"north": {"uv": [8, 13, 9, 16], "texture": "#0"},
				"east": {"uv": [11, 13, 12, 16], "texture": "#0"},
				"south": {"uv": [10, 13, 11, 16], "texture": "#0"},
				"west": {"uv": [9, 13, 10, 16], "texture": "#0"},
				"up": { "uv": [9, 12, 10, 13], "texture": "#0", "rotation": 270 },
				"down": { "uv": [10, 13, 11, 12], "texture": "#0", "rotation": 270 }
			},	//Left Arm

			{"size": [4, 12, 4], "pos": [0, 0, -2], "origin": [0, 0, 0], 
				"north": {"uv": [0, 5, 1, 8], "texture": "#0"},
				"east": {"uv": [3, 5, 4, 8], "texture": "#0"},
				"south": {"uv": [2, 5, 3, 8], "texture": "#0"},
				"west": {"uv": [1, 5, 2, 8], "texture": "#0"},
				"up": { "uv": [1, 4, 2, 5], "texture": "#0", "rotation": 270 },
				"down": { "uv": [2, 4, 3, 5], "texture": "#0", "rotation": 270 }
			},//R Leg

			{"size": [4, 12, 4], "pos": [0, 0, 2], "origin": [0, 0, 0],
				"north": {"uv": [4, 13, 5, 16], "texture": "#0"},
				"east": {"uv": [7, 13, 8, 16], "texture": "#0"},
				"south": {"uv": [6, 13, 7, 16], "texture": "#0"},
				"west": {"uv": [5, 13, 6, 16], "texture": "#0"},
				"up": { "uv": [5, 12, 6, 13], "texture": "#0", "rotation": 270 },
				"down": { "uv": [6, 12, 7, 13], "texture": "#0", "rotation": 270 }
			},// L Leg

			{"size": [8, 8, 8], "pos": [0, 22, 0], "origin": [0, 0, 0], 
				"north": {"uv": [0, 2, 2, 4], "texture": "#0"},
				"east": {"uv": [6, 2, 8, 4], "texture": "#0"},
				"south": {"uv": [4, 2, 6, 4], "texture": "#0"},
				"west": {"uv": [2, 2, 4, 4], "texture": "#0"},
				"up": {"uv": [2, 0, 4, 2],"texture": "#0","rotation": 90 },
				"down": { "uv": [6, 0, 4, 2], "texture": "#0", "rotation": 90 }
			},//Head



			{"size": [4, 12, 8], "pos": [0, 12, 0], "origin": [0, 0, 0],
				"north": {"uv": [4, 5, 5, 8], "texture": "#0"},
				"east": {"uv": [8, 5, 10, 8], "texture": "#0"},
				"south": {"uv": [7, 5, 8, 8], "texture": "#0"},
				"west": {"uv": [5, 5, 7, 8], "texture": "#0"},
				"up": { "uv": [5, 4, 7, 5], "texture": "#0", "rotation": 270 },
				"down": { "uv": [7, 4, 9, 5], "texture": "#0", "rotation": 270 }
			},//Body

				/*
				{"size": [9, 9, 9], "pos": [0, 22, 0], "origin": [0, 0, 0], 
					"north": {"uv": [8, 2, 10, 4], "texture": "#0"},
					"east": {"uv": [14, 2, 16, 4], "texture": "#0"},
					"south": {"uv": [12, 2, 14, 4], "texture": "#0"},
					"west": {"uv": [10, 2, 12, 4], "texture": "#0"},
					"up": {"uv": [10, 0, 12, 2],"texture": "#0","rotation": 90 },
					"down": { "uv": [12, 0, 14, 2], "texture": "#0", "rotation": 270 }
				}//Head Layer

				*/
		]
		var skin = 'assets/player_skin.png';

		scope.buildModel(things, skin);
		updateDisplaySkin()
	}
	buildArmorStand() {
		this.buildModel([
			{
				"size": [12, 1, 12],
				"pos": [0, -5.5, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [0, 11, 3, 11.25], "texture": "#0"},
				"east": {"uv": [3, 11, 6, 11.25], "texture": "#0"},
				"south": {"uv": [6, 11, 9, 11.25], "texture": "#0"},
				"west": {"uv": [9, 11, 12, 11.25], "texture": "#0"},
				"up": {"uv": [3, 8, 6, 11], "texture": "#0","rotation": 90},
				"down": {"uv": [6, 8, 9, 11], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 11, 2],
				"pos": [0, 0.5, -2],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 11, 2],
				"pos": [0, 0.5, 2],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 2, 8],
				"pos": [0, 7, 0],
				"origin": [0, 0, 0],
				"north": {
					"uv": [0.25, 5.75, 0.75, 6.25],
					"texture": "#0"
				},
				"east": {
					"uv": [0.25, 5.75, 2.25, 6.25],
					"texture": "#0"
				},
				"south": {
					"uv": [4.75, 5.75, 5.25, 6.25],
					"texture": "#0"
				},
				"west": {
					"uv": [2.75, 5.75, 4.75, 6.25],
					"texture": "#0"
				},
				"up": {
					"uv": [0, 12.5, 2, 13],
					"texture": "#0",
					"rotation": 90,"rotation": 90
				},
				"down": {
					"uv": [0, 12.5, 2, 13],
					"texture": "#0",
					"rotation": 90, "rotation": 270
				}
			},
			{
				"size": [2, 7, 2],
				"pos": [0, 11.5, 2],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 7, 2],
				"pos": [0, 11.5, -2],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [3, 3, 12],
				"pos": [0, 16.505, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [3, 7.25, 3.75, 8], "texture": "#0"},
				"east": {
					"uv": [3.75, 7.25, 6.75, 8],
					"texture": "#0"
				},
				"south": {
					"uv": [6.75, 7.25, 7.5, 8],
					"texture": "#0"
				},
				"west": {"uv": [0, 7.25, 3, 8], "texture": "#0"},
				"up": {
					"uv": [0.75, 6.5, 3.75, 7.25],
					"texture": "#0",
					"rotation": 90,"rotation": 90
				},
				"down": {
					"uv": [3.75, 6.5, 6.75, 7.25],
					"texture": "#0",
					"rotation": 90, "rotation": 270
				}
			},
			{
				"size": [2, 6, 2],
				"pos": [0, 21, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [0.5, 0.5, 1, 2.25], "texture": "#0"},
				"east": {"uv": [1, 0.5, 1.5, 2.25], "texture": "#0"},
				"south": {"uv": [1.5, 0.5, 2, 2.25], "texture": "#0"},
				"west": {"uv": [0, 0.5, 0.5, 2.25], "texture": "#0"},
				"up": {"uv": [0.5, 0, 1, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [1, 0, 1.5, 0.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 12, 2],
				"pos": [0, 12, -6],
				"origin": [0, 0, 0],
				"north": {"uv": [7, 0.5, 7.5, 3.5], "texture": "#0"},
				"east": {"uv": [6.5, 0.5, 6, 3.5], "texture": "#0"},
				"south": {"uv": [7.5, 0.5, 8, 3.5], "texture": "#0"},
				"west": {"uv": [6, 0.5, 6.5, 3.5], "texture": "#0"},
				"up": {"uv": [6.5, 0, 7, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [7, 0, 7.5, 0.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [2, 12, 2],
				"pos": [0, 12, 6],
				"origin": [0, 0, 0],
				"north": {"uv": [7, 0.5, 7.5, 3.5], "texture": "#0"},
				"east": {"uv": [6.5, 0.5, 7, 3.5], "texture": "#0"},
				"south": {"uv": [7.5, 0.5, 8, 3.5], "texture": "#0"},
				"west": {"uv": [6.5, 0.5, 6, 3.5], "texture": "#0"},
				"up": {"uv": [6.5, 0, 7, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [7, 0, 7.5, 0.5], "texture": "#0","rotation": 270}
			}
		], 'assets/armor_stand.png')
	}
	buildArmorStandSmall() {
		this.buildModel(		[
			{
				"size": [6, 0.5, 6],
				"pos": [0, -5.75, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [0, 11, 3, 11.25], "texture": "#0"},
				"east": {"uv": [3, 11, 6, 11.25], "texture": "#0"},
				"south": {"uv": [6, 11, 9, 11.25], "texture": "#0"},
				"west": {"uv": [9, 11, 12, 11.25], "texture": "#0"},
				"up": {"uv": [3, 8, 6, 11], "texture": "#0","rotation": 90},
				"down": {"uv": [6, 8, 9, 11], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 5.5, 1],
				"pos": [0, -2.75, -1],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 5.5, 1],
				"pos": [0, -2.75, 1],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 1, 4],
				"pos": [0, 0.5, 0],
				"origin": [0, 0, 0],
				"north": {
					"uv": [0.25, 5.75, 0.75, 6.25],
					"texture": "#0"
				},
				"east": {
					"uv": [0.25, 5.75, 2.25, 6.25],
					"texture": "#0"
				},
				"south": {
					"uv": [4.75, 5.75, 5.25, 6.25],
					"texture": "#0"
				},
				"west": {
					"uv": [2.75, 5.75, 4.75, 6.25],
					"texture": "#0"
				},
				"up": {
					"uv": [0, 12.5, 2, 13],
					"texture": "#0",
					"rotation": 90
				},
				"down": {
					"uv": [0, 12.5, 2, 13],
					"texture": "#0",
					"rotation": 90
				}
			},
			{
				"size": [1, 3.5, 1],
				"pos": [0, 2.75, 1],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 3.5, 1],
				"pos": [0, 2.75, -1],
				"origin": [0, 0, 0],
				"north": {"uv": [8.5, 4.5, 9, 7.5], "texture": "#0"},
				"east": {"uv": [9, 4.5, 9.5, 7.5], "texture": "#0"},
				"south": {"uv": [9.5, 4.5, 10, 7.5], "texture": "#0"},
				"west": {"uv": [8, 4.5, 8.5, 7.5], "texture": "#0"},
				"up": {"uv": [8.5, 4, 9, 4.5], "texture": "#0","rotation": 90},
				"down": {"uv": [9, 4, 9.5, 4.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1.5, 1.5, 6],
				"pos": [0, 5.255, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [3, 7.25, 3.75, 8], "texture": "#0"},
				"east": {
					"uv": [3.75, 7.25, 6.75, 8],
					"texture": "#0"
				},
				"south": {
					"uv": [6.75, 7.25, 7.5, 8],
					"texture": "#0"
				},
				"west": {"uv": [0, 7.25, 3, 8], "texture": "#0"},
				"up": {
					"uv": [0.75, 6.5, 3.75, 7.25],
					"texture": "#0",
					"rotation": 90
				},
				"down": {
					"uv": [3.75, 6.5, 6.75, 7.25],
					"texture": "#0",
					"rotation": 90
				}
			},
			{
				"size": [
					1.5,
					4.5,
					1.5
				],
				"pos": [0, 8.27, 0],
				"origin": [0, 0, 0],
				"north": {"uv": [0.5, 0.5, 1, 2.25], "texture": "#0"},
				"east": {"uv": [1, 0.5, 1.5, 2.25], "texture": "#0"},
				"south": {"uv": [1.5, 0.5, 2, 2.25], "texture": "#0"},
				"west": {"uv": [0, 0.5, 0.5, 2.25], "texture": "#0"},
				"up": {"uv": [0.5, 0, 1, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [1, 0, 1.5, 0.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 6, 1],
				"pos": [0, 3, -3],
				"origin": [0, 0, 0],
				"north": {"uv": [7, 0.5, 7.5, 3.5], "texture": "#0"},
				"east": {"uv": [6.5, 0.5, 6, 3.5], "texture": "#0"},
				"south": {"uv": [7.5, 0.5, 8, 3.5], "texture": "#0"},
				"west": {"uv": [6, 0.5, 6.5, 3.5], "texture": "#0"},
				"up": {"uv": [6.5, 0, 7, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [7, 0, 7.5, 0.5], "texture": "#0", "rotation": 270}
			},
			{
				"size": [1, 6, 1],
				"pos": [0, 3, 3],
				"origin": [0, 0, 0],
				"north": {"uv": [7, 0.5, 7.5, 3.5], "texture": "#0"},
				"east": {"uv": [6.5, 0.5, 7, 3.5], "texture": "#0"},
				"south": {"uv": [7.5, 0.5, 8, 3.5], "texture": "#0"},
				"west": {"uv": [6.5, 0.5, 6, 3.5], "texture": "#0"},
				"up": {"uv": [6.5, 0, 7, 0.5], "texture": "#0","rotation": 90},
				"down": {"uv": [7, 0, 7.5, 0.5], "texture": "#0", "rotation": 270}
			}
		], 'assets/armor_stand.png')
	}
	buildZombie() {
		this.buildModel([
			{
				"size": [4, 12, 4],
				"pos": [0, 0, -2],
				"origin": [0, 0, 0],
				"north": {
					"uv": [0.01, 5.01, 0.99, 7.99],
					"texture": "#1"
				},
				"east": {
					"uv": [3.01, 5.01, 3.99, 7.99],
					"texture": "#1"
				},
				"south": {
					"uv": [2.01, 5.01, 2.99, 7.99],
					"texture": "#1"
				},
				"west": {
					"uv": [1.01, 5.01, 1.99, 7.99],
					"texture": "#1"
				},
				"up": {
					"uv": [1.01, 4.01, 1.99, 4.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [2.01, 4.01, 2.99, 4.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [4, 12, 4],
				"pos": [0, 0, 2],
				"origin": [0, 0, 0],
				"north": {
					"uv": [4.01, 13.01, 4.99, 15.99],
					"texture": "#1"
				},
				"east": {
					"uv": [8.01, 13.01, 6.99, 15.99],
					"texture": "#1"
				},
				"south": {
					"uv": [6.01, 13.01, 6.99, 15.99],
					"texture": "#1"
				},
				"west": {
					"uv": [5.01, 13.01, 5.99, 15.99],
					"texture": "#1"
				},
				"up": {
					"uv": [5.01, 12.01, 5.99, 12.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [6.01, 12.01, 6.99, 12.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [4, 12, 8],
				"pos": [0, 12, 0],
				"origin": [0, 0, 0],
				"north": {
					"uv": [4.01, 5.01, 4.99, 7.99],
					"texture": "#1"
				},
				"east": {
					"uv": [8.01, 5.01, 9.99, 7.99],
					"texture": "#1"
				},
				"south": {
					"uv": [7.01, 5.01, 7.99, 7.99],
					"texture": "#1"
				},
				"west": {
					"uv": [5.01, 5.01, 6.99, 7.99],
					"texture": "#1"
				},
				"up": {
					"uv": [5.01, 4.01, 6.99, 4.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [7.01, 4.01, 8.99, 4.99],
					"texture": "#1",
					"rotation": 270
				}
			},
			{
				"size": [8, 8, 8],
				"pos": [0, 22, 0],
				"origin": [0, 0, 0],
				"north": {
					"uv": [0.01, 2.01, 1.99, 3.99],
					"texture": "#1"
				},
				"east": {
					"uv": [6.01, 2.01, 7.99, 3.99],
					"texture": "#1"
				},
				"south": {
					"uv": [4.01, 2.01, 5.99, 3.99],
					"texture": "#1"
				},
				"west": {
					"uv": [2.01, 2.01, 3.99, 3.99],
					"texture": "#1"
				},
				"up": {
					"uv": [2.01, 0.01, 3.99, 1.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [4.01, 0.01, 5.99, 1.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [12, 4, 4],
				"pos": [-4, 16, -6],
				"origin": [0, 0, 0],
				"north": {
					"uv": [12.01, 5.01, 12.99, 7.99],
					"texture": "#1",
					"rotation": 270
				},
				"east": {
					"uv": [11.01, 4.01, 11.99, 4.99],
					"texture": "#1",
					"rotation": 180
				},
				"south": {
					"uv": [10.01, 5.01, 10.99, 7.99],
					"texture": "#1",
					"rotation": 90
				},
				"west": {
					"uv": [12.01, 4.01, 12.99, 4.99],
					"texture": "#1",
					"rotation": 180
				},
				"up": {
					"uv": [11.01, 5.01, 11.99, 7.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [13.01, 5.01, 13.99, 7.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [12, 4, 4],
				"pos": [-4, 16, 6],
				"origin": [0, 0, 0],
				"north": {
					"uv": [10.01, 13.01, 10.99, 15.99],
					"texture": "#1",
					"rotation": 270
				},
				"east": {
					"uv": [9.01, 12.01, 9.99, 12.99],
					"texture": "#1",
					"rotation": 180
				},
				"south": {
					"uv": [8.01, 13.01, 8.99, 15.99],
					"texture": "#1",
					"rotation": 90
				},
				"west": {
					"uv": [10.01, 12.01, 10.99, 12.99],
					"texture": "#1",
					"rotation": 180
				},
				"up": {
					"uv": [9.01, 13.01, 9.99, 15.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [11.01, 13.01, 11.99, 15.99],
					"texture": "#1",
					"rotation": 90
				}
			}
		], 'assets/zombie.png')
	}
	buildBabyZombie() {
		this.buildModel([
			{
				"size": [2, 6, 2],
				"pos": [-2.220446049250313e-16, -3, -1],
				"origin": [0, 0, 0],
				"north": {
					"uv": [0.01, 5.01, 0.99, 7.99],
					"texture": "#1"
				},
				"east": {
					"uv": [3.01, 5.01, 3.99, 7.99],
					"texture": "#1"
				},
				"south": {
					"uv": [2.01, 5.01, 2.99, 7.99],
					"texture": "#1"
				},
				"west": {
					"uv": [1.01, 5.01, 1.99, 7.99],
					"texture": "#1"
				},
				"up": {
					"uv": [1.01, 4.01, 1.99, 4.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [2.01, 4.01, 2.99, 4.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [2, 6, 2],
				"pos": [-2.220446049250313e-16, -3, 1],
				"origin": [0, 0, 0],
				"north": {
					"uv": [4.01, 13.01, 4.99, 15.99],
					"texture": "#1"
				},
				"east": {
					"uv": [8.01, 13.01, 6.99, 15.99],
					"texture": "#1"
				},
				"south": {
					"uv": [6.01, 13.01, 6.99, 15.99],
					"texture": "#1"
				},
				"west": {
					"uv": [5.01, 13.01, 5.99, 15.99],
					"texture": "#1"
				},
				"up": {
					"uv": [5.01, 12.01, 5.99, 12.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [6.01, 12.01, 6.99, 12.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [2, 6, 4],
				"pos": [-2.220446049250313e-16, 3, 0],
				"origin": [0, 0, 0],
				"north": {
					"uv": [4.01, 5.01, 4.99, 7.99],
					"texture": "#1"
				},
				"east": {
					"uv": [8.01, 5.01, 9.99, 7.99],
					"texture": "#1"
				},
				"south": {
					"uv": [7.01, 5.01, 7.99, 7.99],
					"texture": "#1"
				},
				"west": {
					"uv": [5.01, 5.01, 6.99, 7.99],
					"texture": "#1"
				},
				"up": {
					"uv": [5.01, 4.01, 6.99, 4.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [7.01, 4.01, 8.99, 4.99],
					"texture": "#1",
					"rotation": 270
				}
			},
			{
				"size": [6.0, 6.0, 6.0],
				"pos": [0, 9, 0],
				"origin": [0, 9, 0],
				"north": {
					"uv": [0.01, 2.01, 1.99, 3.99],
					"texture": "#1"
				},
				"east": {
					"uv": [6.01, 2.01, 7.99, 3.99],
					"texture": "#1"
				},
				"south": {
					"uv": [4.01, 2.01, 5.99, 3.99],
					"texture": "#1"
				},
				"west": {
					"uv": [2.01, 2.01, 3.99, 3.99],
					"texture": "#1"
				},
				"up": {
					"uv": [2.01, 0.01, 3.99, 1.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [4.01, 0.01, 5.99, 1.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [6, 2, 2],
				"pos": [-2.000000000000001, 5, -3],
				"origin": [0, 0, 0],
				"north": {
					"uv": [12.01, 5.01, 12.99, 7.99],
					"texture": "#1",
					"rotation": 270
				},
				"east": {
					"uv": [11.01, 4.01, 11.99, 4.99],
					"texture": "#1",
					"rotation": 180
				},
				"south": {
					"uv": [10.01, 5.01, 10.99, 7.99],
					"texture": "#1",
					"rotation": 90
				},
				"west": {
					"uv": [12.01, 4.01, 12.99, 4.99],
					"texture": "#1",
					"rotation": 180
				},
				"up": {
					"uv": [11.01, 5.01, 11.99, 7.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [13.01, 5.01, 13.99, 7.99],
					"texture": "#1",
					"rotation": 90
				}
			},
			{
				"size": [6, 2, 2],
				"pos": [-2.000000000000001, 5, 3],
				"origin": [0, 0, 0],
				"north": {
					"uv": [10.01, 13.01, 10.99, 15.99],
					"texture": "#1",
					"rotation": 270
				},
				"east": {
					"uv": [9.01, 12.01, 9.99, 12.99],
					"texture": "#1",
					"rotation": 180
				},
				"south": {
					"uv": [8.01, 13.01, 8.99, 15.99],
					"texture": "#1",
					"rotation": 90
				},
				"west": {
					"uv": [10.01, 12.01, 10.99, 12.99],
					"texture": "#1",
					"rotation": 180
				},
				"up": {
					"uv": [9.01, 13.01, 9.99, 15.99],
					"texture": "#1",
					"rotation": 90
				},
				"down": {
					"uv": [11.01, 13.01, 11.99, 15.99],
					"texture": "#1",
					"rotation": 90
				}
			}
		], 'assets/zombie.png')
	}
	buildMonitor() {
		this.buildModel([
			{"size": [0.1, 8, 8], "pos": [-31.2, 4.93, 0], "origin": [0, 0, 0], "north":{"uv":[0,0,0,0]},"east":{"uv":[0,0,0,0]},"south":{"uv":[0,0,0,0]},"west":{"uv":[0,0,16,16]},"up":{"uv":[0,0,0,0]},"down":{"uv":[0,0,0,0]}},
			{"size": [0.1, 8, 8], "pos": [-31.2, -4.93, 0], "origin": [0, 0, 0], "north":{"uv":[0,0,0,0]},"east":{"uv":[0,0,0,0]},"south":{"uv":[0,0,0,0]},"west":{"uv":[0,0,16,16]},"up":{"uv":[0,0,0,0]},"down":{"uv":[0,0,0,0]}},
			{"size": [0.1, 8, 8], "pos": [-31.2, 0, 5.65], "origin": [0, 0, 0], "north":{"uv":[0,0,0,0]},"east":{"uv":[0,0,0,0]},"south":{"uv":[0,0,0,0]},"west":{"uv":[0,0,16,16]},"up":{"uv":[0,0,0,0]},"down":{"uv":[0,0,0,0]}},
			{"size": [0.1, 8, 8], "pos": [-31.2, 0, -5.65], "origin": [0, 0, 0], "north":{"uv":[0,0,0,0]},"east":{"uv":[0,0,0,0]},"south":{"uv":[0,0,0,0]},"west":{"uv":[0,0,16,16]},"up":{"uv":[0,0,0,0]},"down":{"uv":[0,0,0,0]}}
		], 'black')
	}
	buildBlock() {
		this.buildModel([
			{"size": [16,16,16], "pos": [0, 0, 0], "origin": [0, 0, 0], "north":{"uv":[0,0,16,16]},"east":{"uv":[0,0,16,16]},"south":{"uv":[0,0,16,16]},"west":{"uv":[0,0,16,16]},"up":{"uv":[0,0,16,16]},"down":{"uv":[0,0,16,16]}},	//Right Arm
		], 'assets/missing.png')
	}
	buildFrame() {
		this.buildBlock()
		this.buildModel([
			{"size": [10,10,0.5], "pos": [0, 0, -8.25], "origin": [0, 0, 0], "north":{"uv":[3,3,13,13]},"east":{"uv":[0,0,0,0]},"south":{"uv":[0,0,0,0]},"west":{"uv":[0,0,0,0]},"up":{"uv":[0,0,0,0]},"down":{"uv":[0,0,0,0]}},

			{"size": [1,12,1], "pos": [5.5, 0, -8.5], "origin": [0, 0, 0], "north":{"uv":[2,2,3,14]},"east":{"uv":[2,2,3,14]},"south":{"uv":[2,2,3,14]},"west":{"uv":[2,2,3,14]},"up":{"uv":[2,2,3,3]},"down":{"uv":[2,2,3,3]}},
			{"size": [1,12,1], "pos": [-5.5, 0, -8.5], "origin": [0, 0, 0], "north":{"uv":[2,2,3,14]},"east":{"uv":[2,2,3,14]},"south":{"uv":[2,2,3,14]},"west":{"uv":[2,2,3,14]},"up":{"uv":[2,2,3,3]},"down":{"uv":[2,2,3,3]}},

			{"size": [10,1,1], "pos": [0, 5.5, -8.5], "origin": [0, 0, 0], "north":{"uv":[3,2,13,3]},"east":{"uv":[3,2,13,3]},"south":{"uv":[3,2,13,3]},"west":{"uv":[3,2,13,3]},"up":{"uv":[3,2,13,3]},"down":{"uv":[3,2,13,3]}},
			{"size": [10,1,1], "pos": [0, -5.5, -8.5], "origin": [0, 0, 0], "north":{"uv":[3,13,13,14]},"east":{"uv":[3,13,13,14]},"south":{"uv":[3,13,13,14]},"west":{"uv":[3,13,13,14]},"up":{"uv":[3,13,13,14]},"down":{"uv":[3,13,13,14]}}
		], 'assets/item_frame.png')
	}
}
var displayReferenceObjects = {
	refmodels: {
		player: 			new refModel('player'),
		zombie: 			new refModel('zombie'),
		armor_stand: 		new refModel('armor_stand'),
		baby_zombie: 		new refModel('baby_zombie'),
		armor_stand_small:  new refModel('armor_stand_small'),
		monitor: 			new refModel('monitor'),
		bow: 				new refModel('bow'),
		block: 				new refModel('block'),
		frame: 				new refModel('frame'),
		inventory_nine: 	new refModel('inventory_nine'),
		inventory_full:		new refModel('inventory_full'),
		hud: 				new refModel('hud')
	},
	active: '',
	bar: function(buttons) {
		$('#display_ref_bar').html('')
		if (buttons.length === 10000) {
			this.refmodels[buttons[0]].load()
			return;
		}
		if (buttons.length < 2) {
			$('.reference_model_bar').css('visibility', 'hidden')
		} else {
			$('.reference_model_bar').css('visibility', 'visible')
		}
		var i = 0;
		while (i < buttons.length) {
			var ref = this.refmodels[buttons[i]]
			var icon = 'icon-'+ref.icon
			switch (icon) {
				case 'icon-monitor': icon = 'fa fa-asterisk'; break;
			}
			var button = $(
				'<div><input class="hidden" type="radio" name="refmodel" id="'+ref.id+'"'+ (i === 0 ? ' selected' : '') +'>'+
				'<label class="tool" onclick="displayReferenceObjects.refmodels.'+ref.id+'.load()" for="'+ref.id+'"><i class="'+icon+'"></i><div class="tooltip">'+ref.name+'</div></label></div>'
			)
			$('#display_ref_bar').append(button)
			if (i === 0) {
				ref.load()
				button.find('input').prop("checked", true)
			}
			i++;
		}
	},
	clear: function() {
		display_scene.remove(displayReferenceObjects.active.model)
		displayReferenceObjects.active = false
		$('#donation_hint').hide()
	},
	slots: [
		'thirdperson_righthand',
		'thirdperson_lefthand',
		'firstperson_righthand',
		'firstperson_righthand',
		'ground',
		'gui',
		'head',
		'fixed',
	]
}

function enterDisplaySettings() {		//Enterung Display Setting Mode, changes the scene etc
	display_mode = true;

	selected = []
	updateSelection()

	if (quad_previews.enabled) {
		quad_previews.enabled_before = true
		main_preview.fullscreen()
	}
	main_preview.setNormalCamera()
	main_preview.camPers.position.set(-80, 40, -30)
	main_preview.camPers.setFocalLength(45)

	
	$('body').addClass('display_mode')
	$('.m_edit').hide()
	$('.m_disp').show()
	$('#display_bar input#thirdperson_righthand').prop("checked", true)
	updateInterface()
	//return;

	loadDispThirdRight()
	buildGrid()
	setShading()
	Canvas.updateRenderSides()
	resizeWindow()
	if (outlines.children.length) {
		outlines.children.length = 0
		Canvas.updateAllPositions()
	}
}
function exitDisplaySettings() {		//Enterung Display Setting Mode, changes the scene etc
	resetDisplayBase()
	setDisplayArea(0,0,0, 0,0,0, 1,1,1)

	setTimeout(() => {

		display_mode = false;

		main_preview.controls.target.set(0,-3,0)
		main_preview.camPers.position.set(-20, 20, -20)
		main_preview.controls.enabled = true
		main_preview.setNormalCamera()
		main_preview.camPers.setFocalLength(45)

		$('.m_disp').hide()
		$('.m_edit').show()
		$('.selection_only').css('visibility', 'hidden')
		$('body').removeClass('display_mode')
		resizeWindow()
		updateInterface()
		if (quad_previews.enabled_before) {
			openQuadView()
		}

		buildGrid()
		setShading()
		Canvas.updateRenderSides()
		setTimeout(function() {
			main_preview.camPers.setFocalLength(45)
		}, 20)
	}, 60)

}
function axisIndex(index) {
	if (typeof index === 'number') {
		if (index === 0) return 'x';
		if (index === 1) return 'y';
		if (index === 2) return 'z';
	} else {
		if (index === 'x') return 0;
		if (index === 'y') return 1;
		if (index === 'z') return 2;
	}
}
function resetDisplayBase() {
	display_base.rotation['x'] = Math.PI / (180 / 0.1);
	display_base.rotation['y'] = Math.PI / (180 / 0.1);
	display_base.rotation['z'] = Math.PI / (180 / 0.1);

	display_base.position['x'] = 0;
	display_base.position['y'] = 0;
	display_base.position['z'] = 0;

	display_base.scale['x'] = 1;
	display_base.scale['y'] = 1;
	display_base.scale['z'] = 1;
}


function syncDispInput(obj, sender, axis, event) {//Syncs Range and Input, calls the change functions
	var val = $(obj).val()
	var raw_val;
	if (typeof val === 'string' || val instanceof String) {
		val = parseFloat(val.replace(/[^-.0-9]/g, ""))
	}
	if (isNaN(val)) val = 0

	if (sender === 'rotation') {
		if (val > 180) val = 180
		if (val < -180) val = -180
		$(obj).siblings('input').val(val)
		dispRotate(val, axis)
		return;
	} else if (sender === 'translation') {
		if (val > 80) val = 80
		if (val < -80) val = -80
		$(obj).siblings('input').val(val);
		dispTranslate(val, axis)
		return;
	} else if (sender === 'scaleRange') {
		//From Range to Real
		raw_val = val
		if (val >= 0) {
			val = (val*(3/4))+1
			if (val >=4) val = 4
		} else {
			val = (val+4)/4
		}
		$(obj).parent().find('input.scale').val(val)
	} else if (sender === 'scale') {
		//From Input(Real) to Range
		if (display[display_slot].scale == undefined) {
			display[display_slot].scale = [1,1,1]
		}
		if (val >= 1) {
			raw_val = (val-1)*(4/3)
		} else {
			raw_val =(val*4)-4
		}
	}

	if (holding_shift === true) {
		dispScale(val, 'x')
		dispScale(val, 'y')
		dispScale(val, 'z')
		$('#display_settings input.scale').val(val)
		$('#display_settings input.scaleRange').val(raw_val)
	} else {
		dispScale(val, axis)		
		$(obj).parent().find('input.scaleRange').val(raw_val)
	}
}
function dispRotate(val, axis) {		//Change the actual thing
	if (display[display_slot].rotation == undefined) {
		display[display_slot].rotation = [0,0,0]
	}
	display[display_slot].rotation[axisIndex(axis)] = val
	if (display_slot === 'thirdperson_lefthand' && axis === 'y') val *= (-1)
	if (display_slot === 'firstperson_lefthand' && axis === 'y') val *= (-1)
	if (display_slot === 'thirdperson_lefthand' && axis === 'z') val *= (-1)
	if (display_slot === 'firstperson_lefthand' && axis === 'z') val *= (-1)
	display_base.rotation[axis] = Math.PI / (180 / val);
}
function dispTranslate(val, axis) {		//Change the actual thing
	if (display[display_slot].translation == undefined) {
		display[display_slot].translation = [0,0,0]
	}
	display[display_slot].translation[axisIndex(axis)] = val
	if (display_slot === 'thirdperson_lefthand' && axis === 'x') val *= (-1)
	if (display_slot === 'firstperson_lefthand' && axis === 'x') val *= (-1)
	display_base.position[axis] = val
}
function dispScale(val, axis) {			//Change the actual thing
	if (display[display_slot].scale == undefined) {
		display[display_slot].scale = [0,0,0]
	}
	val = limitNumber(val, 0.001, 4)
	display[display_slot].scale[axisIndex(axis)] = val
	if (val == 0) val = 0.001
	display_base.scale[axis] = val
}

function resetDisplaySettings(key) {
	delete display[display_slot][key]
	$('input#'+key+'_x').val(0)
	$('input#'+key+'_y').val(0)
	$('input#'+key+'_z').val(0)
	if (key == 'rotation') {
		display_base.rotation.x = Math.PI / (180 / 0);
		display_base.rotation.y = Math.PI / (180 / 0);
		display_base.rotation.z = Math.PI / (180 / 0);
	} else if (key == 'translation') {
		display_base.position.x = 0
		display_base.position.y = 0
		display_base.position.z = 0
	} else if (key == 'scale') {
		$('input#scale_x.scale').val(1)
		$('input#scale_y.scale').val(1)
		$('input#scale_z.scale').val(1)
		display_base.scale.x = 1
		display_base.scale.y = 1
		display_base.scale.z = 1
	}
}

function applyDisplayPreset(preset, all) {
	if (preset == undefined) return;
	var slots = [display_slot]
	if (all) {
		slots = displayReferenceObjects.slots
	} else if (preset.areas[display_slot] == undefined) {
		Blockbench.showQuickMessage('message.preset_no_info')
		return;
	};
	slots.forEach(function(sl) {
		if (!preset.areas[sl]) return;
		if (typeof display[sl] !== 'object') display[sl] = {}
		$.extend(true, display[sl], preset.areas[sl])
	})
	loadSlot(display_slot)
}
function createPreset() {
	var name = $('input#preset_name').val()
	if (name == '') {
		$('input#preset_name').val(tl('"display.preset.blank_name'))
		return;
	} else {
		$('input#preset_name').val('new preset')
	}
	var preset = {name: name, areas: {}}
	display_presets.push(preset)

	displayReferenceObjects.slots.forEach(function(s) {
		if ($('#'+s+'_save').is(':checked')) {
			preset.areas[s] = display[s]
		}
	})
	hideDialog()
	localStorage.setItem('display_presets', JSON.stringify(display_presets))
}


function setDisplayArea(x, y, z, rx, ry, rz, sx, sy, sz) {//Sets the Work Area to the given Space
	display_area.rotation['x'] = Math.PI / (180 / rx);
	display_area.rotation['y'] = Math.PI / (180 / ry);
	display_area.rotation['z'] = Math.PI / (180 / rz);

	display_area.position['x'] = x;
	display_area.position['y'] = y;
	display_area.position['z'] = z;

	display_area.scale['x'] = sx;
	display_area.scale['y'] = sy;
	display_area.scale['z'] = sz;
}
function groundAnimation() {
	display_area.rotation.y += 0.015
	ground_timer += 1
	display_area.position.y = 13.5 + Math.sin(Math.PI * (ground_timer / 100)) * Math.PI/2
	if (ground_timer === 200) ground_timer = 0;
}

function getDisplayNumber(key, mode, axis) {
	var def = 0
	if (mode == 'scale') {
		def = 1
	}
	if (display[key] == undefined) {
		return def;
	}
	if (display[key][mode] == undefined) {
		return def;
	}
	if (display[key][mode][axis] != undefined) {
		var val = display[key][mode][axis];
		if (mode == 'scale' && val == 0) {
			val = 0.001;
		}
		return val;
	} else {
		return def;
	}
}
function loadDisp(key, skin) {	//Loads The Menu and slider values, common for all Radio Buttons
	display_slot = key
	//enterScene(key)
	resetDisplayBase()
	if (key !== 'gui' && main_preview.isOrtho === true) {
		main_preview.setNormalCamera()
	}
	main_preview.controls.enabled = true;
	ground_animation = false;
	$('input#translation_z').prop('disabled', false)
	$('#donation_hint').hide()
	main_preview.camPers.setFocalLength(45)

	if (display[key] == undefined) {
		display[key] = {}
	}
	$('input#rotation_x').val(getDisplayNumber(key, 'rotation', 0))
	$('input#rotation_y').val(getDisplayNumber(key, 'rotation', 1))
	$('input#rotation_z').val(getDisplayNumber(key, 'rotation', 2))

	$('input#translation_x').val(getDisplayNumber(key, 'translation', 0))
	$('input#translation_y').val(getDisplayNumber(key, 'translation', 1))
	$('input#translation_z').val(getDisplayNumber(key, 'translation', 2))

	$('input#scale_x').val(getDisplayNumber(key, 'scale', 0))
	$('input#scale_y').val(getDisplayNumber(key, 'scale', 1))
	$('input#scale_z').val(getDisplayNumber(key, 'scale', 2))
	syncDispInput($('input#scale_x'), 'scale')
	syncDispInput($('input#scale_y'), 'scale')
	syncDispInput($('input#scale_z'), 'scale')

	display_base.rotation['x'] = Math.PI / (180 / getDisplayNumber(key, 'rotation', 0));
	display_base.rotation['y'] = Math.PI / (180 / getDisplayNumber(key, 'rotation', 1));
	display_base.rotation['z'] = Math.PI / (180 / getDisplayNumber(key, 'rotation', 2));

	display_base.position['x'] = getDisplayNumber(key, 'translation', 0);
	display_base.position['y'] = getDisplayNumber(key, 'translation', 1);
	display_base.position['z'] = getDisplayNumber(key, 'translation', 2);

	display_base.scale['x'] = getDisplayNumber(key, 'scale', 0);
	display_base.scale['y'] = getDisplayNumber(key, 'scale', 1);
	display_base.scale['z'] = getDisplayNumber(key, 'scale', 2);
}
function loadDispThirdRight() {	//Loader
	loadDisp('thirdperson_righthand', true)
	displayReferenceObjects.bar(['player', 'zombie', 'baby_zombie', 'armor_stand', 'armor_stand_small'])
}
function loadDispThirdLeft() {	//Loader
	loadDisp('thirdperson_lefthand', true)
	display_base.position['x'] = -getDisplayNumber('thirdperson_lefthand', 'translation', 0)
	display_base.rotation['y'] = Math.PI / (180 / -getDisplayNumber('thirdperson_lefthand', 'rotation', 1))
	display_base.rotation['z'] = Math.PI / (180 / -getDisplayNumber('thirdperson_lefthand', 'rotation', 2))
	displayReferenceObjects.bar(['player', 'zombie', 'baby_zombie', 'armor_stand', 'armor_stand_small'])
}
function loadDispFirstRight() {	//Loader
	loadDisp('firstperson_righthand')
	setDisplayArea(-20.8, -8.4, 9, 0, 270, 0, 1,1,1)
	main_preview.camPers.setFocalLength(12)
	main_preview.camPers.position.set(-32.4, 0, 0)
	main_preview.controls.target.set(0,0,0)
	main_preview.controls.enabled = false
	displayReferenceObjects.bar(['monitor', 'bow'])
}
function loadDispFirstLeft() {	//Loader
	loadDisp('firstperson_lefthand')
	display_base.position['x'] = -getDisplayNumber('firstperson_lefthand', 'translation', 0)
	display_base.rotation['y'] = Math.PI / (180 / -getDisplayNumber('firstperson_lefthand', 'rotation', 1))
	display_base.rotation['z'] = Math.PI / (180 / -getDisplayNumber('firstperson_lefthand', 'rotation', 2))
	setDisplayArea(-20.5, -8.4, -9, 0, 270, 0, 1,1,1)
	main_preview.camPers.setFocalLength(12)
	main_preview.camPers.position.set(-32.4, 0, 0)
	main_preview.controls.target.set(0,0,0)
	main_preview.controls.enabled = false
	displayReferenceObjects.bar(['monitor', 'bow'])
}
function loadDispHead() {		//Loader
	loadDisp('head', true)
	displayReferenceObjects.bar(['player', 'zombie', 'baby_zombie', 'armor_stand', 'armor_stand_small'])
}
function loadDispGUI() {		//Loader
	loadDisp('gui')
	setDisplayArea(0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.4)
	main_preview.camOrtho.zoom = 1
	main_preview.controls.target.set(0,0,0)
	//controls.enabled = false
	main_preview.setOrthographicCamera(2)
	main_preview.camOrtho.position.set(0,0,32)
	displayReferenceObjects.bar(['inventory_nine', 'inventory_full', 'hud'])
}
function loadDispGround() {		//Loader
	loadDisp('ground')
	setDisplayArea(0, 12, 0, 0, 0, 0, 1, 1, 1)
	ground_animation = true;
	ground_timer = 0
	displayReferenceObjects.bar(['block'])
}
function loadDispFixed() {		//Loader
	loadDisp('fixed')
	setDisplayArea(0, 0, -8.5, 0, 0, 0, 0.5, 0.5, 0.5)
	displayReferenceObjects.bar(['frame'])
}
function loadSlot(slot) {
		switch (slot) {
		case 'thirdperson_righthand':
		loadDispThirdRight()
		break;
		case 'thirdperson_lefthand':
		loadDispThirdLeft()
		break;
		case 'firstperson_righthand':
		loadDispFirstRight()
		break;
		case 'firstperson_lefthand':
		loadDispFirstLeft()
		break;
		case 'head':
		loadDispHead()
		break;
		case 'gui':
		loadDispGUI()
		break;
		case 'ground':
		loadDispGround()
		break;
		case 'fixed':
		loadDispFixed()
		break;
	}
}

function copyDisplaySlot() {
	var base_setting = {rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1, 1, 1]}
	$.extend(true, base_setting, display[display_slot])
	display_clipboard = base_setting
}
function pasteDisplaySlot() {
	if (display_clipboard == undefined) return;

	if (typeof display_clipboard.rotation === 'object' && display_clipboard.rotation.join('_') === '0_0_0') {
		delete display[display_slot].rotation;
	} else {
		display[display_slot].rotation = display_clipboard.rotation.slice();
	}

	if (typeof display_clipboard.translation === 'object' && display_clipboard.translation.join('_') === '0_0_0') {
		delete display[display_slot].translation;
	} else {
		display[display_slot].translation = display_clipboard.translation.slice();
	}

	if (typeof display_clipboard.scale === 'object' && display_clipboard.scale.join('_') === '1_1_1') {
		delete display[display_slot].scale;
	} else {
		display[display_slot].scale = display_clipboard.scale.slice();
	}
	/*
	var clear_content = {}
	$.extend(true, clear_content, display_clipboard)
	$.extend(true, display[slot], clear_content)
	*/
	loadSlot(display_slot)
}

function changeDisplaySkin() {
	Blockbench.showMessageBox({
		translateKey: 'display_skin',
		icon: 'icon-player',
		buttons: [
			tl('message.display_skin.upload'),
			tl('message.display_skin.name'),
			tl('message.display_skin.reset')
		],
		confirm: 0,
		cancel: 1
	}, function(result) {
		if (result === 2) {
			settings.display_skin.value = false
			updateDisplaySkin()
		} else if (result === 1) {
			if (typeof settings.display_skin.value === 'string' && settings.display_skin.value.substr(0, 9) === 'username:') {
				var before = settings.display_skin.value.replace('username:', '')
			} else {
				var before = ''
			}
			Blockbench.textPrompt(tl('message.display_skin.name'), before, function(text) {
				settings.display_skin.value = 'username:'+text
				updateDisplaySkin()
			})
		} else {
			Blockbench.import({
				extensions: ['png'],
				type: 'PNG Player Skin',
				readtype: 'image'
			}, function(files) {
				if (files.length) {
					settings.display_skin.value = isApp ? files[0].path : files[0].content
					updateDisplaySkin()
				}
			})
		}
	})
}
function updateDisplaySkin() {
	var val = settings.display_skin.value
	var source;
	function setPSkin(skin) {
		if (!displayReferenceObjects.refmodels.player.material) {
			return;
		}
		var mat = displayReferenceObjects.refmodels.player.material


		var img = new Image()
		try {
			img.src = skin
		} catch(err) {
		}
		img.onload = function() {
			mat.map.dispose()
			var tex = new THREE.Texture(img)
			img.tex = tex;
			img.tex.magFilter = THREE.NearestFilter
			img.tex.minFilter = THREE.NearestFilter
			this.tex.needsUpdate = true;
			mat.map = tex
		}


	}
	if (!val) {
		setPSkin('assets/player_skin.png')

	} else if (typeof val === 'string' && val.substr(0, 9) === 'username:') {
		var username = val.substr(9)
		$.getJSON('https://api.mojang.com/users/profiles/minecraft/'+username, function(uuid) {
			if (uuid && uuid.id) {

				$.getJSON('https://sessionserver.mojang.com/session/minecraft/profile/'+uuid.id, function(data) {
					if (data && data.properties) {
						var skin_path;
						try {
							skin_path = JSON.parse(atob(data.properties[0].value)).textures.SKIN.url
						} catch (err) {}
						setPSkin(skin_path)
					}
				})
			}
		})
	} else {
		setPSkin(val)
	}
	//displayReferenceObjects.refmodels.player.material
}