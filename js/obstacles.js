function Obstacles(threshold, maxObstacles) {
    this.obstacles_array = [];
    this.obstacles_meshes = [];
    this.threshold = threshold;
    this.spawnTime = 0.8;
    this.elapsedTime = 0;
    this.totalMeshes = 0;
    this.maxObstacles = maxObstacles || 1; //If not specified as input,
                                           //default value is 1.
    
    this.add = function(o){
        this.obstacles_array.push(o);
    };
    
    // despawnes the obstacles behind a z threshold
    this.despawn = function(){
        this.obstacles_array = this.obstacles_array.filter(function (e) {
	    if(e.getInstance().position.z < threshold)
                e.dispose();
            return e.getInstance().position.z >= threshold;
	});
    };
    
    /* Updates the obstacles position using the current obstacle speed and
     * the time passed since the last render
     */
    this.update = function(speed, delta){
        for(var i = 0; i<this.obstacles_array.length; i++){
            this.obstacles_array[i].update(speed,delta);
        }
    };
    
    /* Spawn an obstacle if enough time is passed and 
     * updates the elapsed and spawn time
     */ 
    this.spawn = function(scene, delta){
        if (this.obstacles_meshes.length == 0 ) {
            this.meshLoader(scene);
            return;
        }
        this.elapsedTime += delta;
        if(this.elapsedTime < (5*Math.exp(-0.05 * globalTime) + 0.2))
            return;
        this.elapsedTime = 0;
       this.spawnObstacleGroup(this.meshPicker(this.maxObstacles));
    };
    
    /* if the obstacle has multiple parts, this function handles the 
     * spawning of all the parts
     */
    this.spawnObstacleGroup = function(selectedObstacles) {
        for (var i = 0; i < selectedObstacles.length; i++) {
            selectedObstacles[i].spawn();
            this.add(selectedObstacles[i]);
        }
    };
    
    /**
     * In this method we are required to check every selected mesh type in
     * order to create the proper corresponding object. Further meshes must be
     * added manually to the switch case with the proper class.
     */
    this.meshPicker = function(numberOfMeshes) {
        var aboutToSpawn = [];
        var i = 0;
        while(i < numberOfMeshes) {
            var randomIndex = this.getRandomInt(0,this.obstacles_meshes.length);
            var pickedMesh = this.obstacles_meshes[randomIndex];
            switch(pickedMesh.type) {
                case "nitro_barrel":
                    var nitroBarrel = new Barrel(pickedMesh.createInstance("B" + (this.totalMeshes < 10) ? "0" + this.totalMeshes : this.totalMeshes ));
                    aboutToSpawn.push(nitroBarrel);
                    i++;
                    this.totalMeshes++;
                    break;
                
                case "propeller" :
                    if (Math.random() < 0.1 ) {
                        var propeller = new Propeller(
                            meshPropellerCenter.createInstance("P" + (this.totalMeshes < 10) ? "0" + this.totalMeshes : this.totalMeshes ),
                            meshAirScrew.createInstance("P1" + (this.totalMeshes < 10) ? "0" + this.totalMeshes : this.totalMeshes ),
                            meshAirScrew.createInstance("P2" + (this.totalMeshes < 10) ? "0" + this.totalMeshes : this.totalMeshes ));
                        aboutToSpawn.push(propeller);
                        i++;
                        this.totalMeshes++;
                    }
                    break;
                    
                default:
            }
        }
        return aboutToSpawn;
    };
    
    this.getCurrentObstacles = function() {
        return this.obstacles_array;
    }
    
    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    
    /* init the functions used to load different obstacles meshes */
    this.meshLoader = function() {
        this.obstacles_meshes.push(meshPropellerCenter);
        this.obstacles_meshes.push(meshBarrel);
    };
}