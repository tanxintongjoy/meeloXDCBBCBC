import com.anonymous.MEELOxDCB.meeloxdcbapp.InstalledAppsPackage;
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new InstalledAppsPackage()); // add your package here
    return packages;
}

