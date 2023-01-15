
type IProps = {
    onHover: (name: string) => void;
};

export const Mouse: React.FC<IProps> = ({ onHover }) => {

    return (

        <svg
            className="mouse-svg"
            width="80.221mm"
            height="129.88mm"
            version="1.1"
            viewBox="0 0 80.221 129.88"
            xmlns="http://www.w3.org/2000/svg">
            <path
                onMouseOver={() => onHover('mouse-left')}
                d="m 0.0302093,51.352714 c -0.331724,-18.93528 2.058331,-31.27963 7.673732,-39.6339 1.424904,-2.1198998 4.5987927,-5.1973098 6.6638917,-6.4612798 5.582891,-3.41721 12.026436,-5.03093999 20.864139,-5.22524999 1.46596,-0.03220000081 2.706821,-0.042 2.757474,-0.0217 0.05064,0.0203 0.06134,1.63641999 0.02376,3.59141999 l -0.06834,3.55456 -0.855178,0.61288 c -0.470348,0.33708 -1.198802,1.01029 -1.618785,1.49602 -1.219828,1.4107898 -1.428766,2.2754598 -1.639133,6.7834698 -0.226085,4.84482 -0.31843,15.74922 -0.150006,17.71343 0.171848,2.00413 0.424695,2.52413 2.098061,4.31493 0.847249,0.90674 1.427609,1.63726 1.501048,1.8895 0.06584,0.22619 0.09411,2.7136 0.0628,5.52758 l -0.05692,5.11634 -0.898637,0.0442 c -14.859357,0.73047 -22.911239,1.9835 -33.1673367,5.1615 -1.625567,0.5037 -2.987805,0.88361 -3.02719,0.84423 -0.03962,-0.0392 -0.112894,-2.4279 -0.163345,-5.30784 z" />
            <path
                className="disable"
                d="m 42.914837,45.022654 0.084,-5.49376 0.74985,-0.37643 c 0.970003,-0.48695 2.223268,-1.85224 2.775801,-3.02392 0.33644,-0.71344 0.439854,-1.51772 0.587727,-4.57097 0.234071,-4.83313 0.345522,-16.53025 0.175097,-18.37691 -0.242985,-2.63285 -0.707667,-3.4728398 -2.943038,-5.3199298 l -0.833677,-0.68887 0.0596,-3.56958 c 0.03667,-2.19889 0.140103,-3.56460999 0.269266,-3.55664999 1.544992,0.0952 7.392207,0.82537 9.112187,1.13783999 5.827235,1.05863 10.644866,2.94929 14.272056,5.60103 1.467231,1.07266 3.813931,3.4880098 4.978021,5.1236498 4.81516,6.76572 7.25515,16.3583 7.86949,30.93822 0.16753,3.97596 0.20306,11.76335 0.0625,13.70193 l -0.10854,1.49702 -3.45198,-1.16886 c -9.351441,-3.16644 -18.640571,-4.97415 -30.227424,-5.88239 -1.814917,-0.14226 -3.348237,-0.30793 -3.407375,-0.36816 -0.05918,-0.0602 -0.06973,-2.58169 -0.02354,-5.60326 z" />
            <path
                onMouseOver={() => onHover('mouse-move')}
                // style="fill:#000000;stroke-width:0.160104"
                d="M 12.16011,119.17893 C 5.5459003,110.88303 2.3219823,98.534524 0.9728263,76.328464 c -0.318989,-5.2503 -0.653357,-13.11417 -0.619555,-14.57104 0.04231,-1.82352 0.180791,-2.0248 1.812092,-2.63378 6.515279,-2.4322 19.0089087,-4.96216 26.8049707,-5.42799 4.932271,-0.29473 14.691533,-0.22711 19.836109,0.13743 3.552271,0.2517 9.853506,1.19882 14.157762,2.12801 6.411952,1.3842 16.392992,4.63032 16.891302,5.49354 0.26985,0.46746 -0.16071,11.47905 -0.72355,18.50479 -2.07533,25.905426 -8.61147,39.752816 -21.793839,46.172096 -8.50036,4.13934 -22.263226,4.95732 -32.096084,1.90759 -2.753129,-0.8539 -6.268693,-2.66184 -8.48565,-4.36389 -1.352604,-1.03845 -3.564681,-3.20241 -4.596274,-4.49629 z" />
        </svg>);
}