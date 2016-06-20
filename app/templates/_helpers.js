var assertOnOctobluDashboard = function(casper){
  casper.waitForText("dashboard", function(){
    this.echo("success");
    this.exit()
  }, function(){
    console.log("failure")
    console.log(this.echo(casper.captureBase64('png')))
    this.exit(1)
  });
};

var buildCasper = function(Casper){
  var casper = Casper.create({
    waitTimeout: (10 * 1000),
    onError: (function(error){
      console.log("failure due to error: " + error)
      console.log(this.echo(casper.captureBase64('png')))
      casper.exit(1)
    })
  });

  casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36');
  casper.start('https://app.octoblu.com/');

  casper.waitForSelector(".auth.login");
  return casper;
};

var reportErrors = function(f) {
  try {
    return f();
  } catch (e) {
    casper.echo("failure")
    casper.echo(casper.captureBase64('png'))
    this.exit(1)
  }
};

var thenWithErrors = function(casper, f){
  return casper.then(function() {
    return reportErrors(f);
  });
};

module.exports = {
  assertOnOctobluDashboard: assertOnOctobluDashboard,
  buildCasper: buildCasper,
  reportErrors: reportErrors,
  thenWithErrors: thenWithErrors
};
