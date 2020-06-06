<?
ini_set("memory_limit", "-1");

require __DIR__ . '/vendor/autoload.php';
$factory = new \DanielKm\Zoomify\ZoomifyFactory;

$config = array('tileFormat' => 'png', '_tileExt' => 'png', 'tileQuality' => 9);
$zoomify = $factory($config);

$inPath = $argv[1];
$outPath = $argv[2];
$result = $zoomify->process($inPath, $outPath);

// unlink($inPath);
unlink($outPath . "/ImageProperties.xml");

?>
