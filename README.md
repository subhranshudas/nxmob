# NX mobile workspace with SDK package structure

```bash
git clone https://github.com/subhranshudas/nxmob.git
```

```bash
yarn install
```


**After that please make sure you have followed the [Environment Set instructions for React Native](https://reactnative.dev/docs/environment-setup) as per your machine and the simulator you want to run.**

## Running the Mobile App on IOS
In VSC checkout NX extensions and click on the target for RUN-IOS under `demonative`

## Running the Mobile App on IOS
In VSC checkout NX extensions and click on the target for RUN-ANDROID under `demonative`


## Publishing changes

After making changes in GIT

```
cd packages/uimobile
```

```
npm version <minor|patch>
git push origin main
```

Use NX to build the `uimobile` package

```
cd dist/packages/uimobile
```

```
npm login
.
.
.
.
npm publish --access public
```

