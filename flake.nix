{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }:
  let
    pkgs = import nixpkgs { inherit system; };
    system = "x86_64-linux";
  in rec {
    devShells.${system}.default = pkgs.mkShell rec {
      buildInputs = with pkgs; [
        nodejs_22
      ];
    };
  };
}
