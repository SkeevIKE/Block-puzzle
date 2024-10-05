import { _decorator, Node, tween, TweenEasing, Vec3 } from 'cc';

export class TweenAnimation {
    
    public static moveToWorldPosition(node: Node, worldPosition: Vec3, time: number = 0.1, easing: TweenEasing = 'sineOut'): void {           
        const newTween = tween(node).to(time, { worldPosition }, { easing });
        if (!node['__activeTweens']) {
            node['__activeTweens'] = [];
        }
        node['__activeTweens'].push(newTween);
        newTween.start();
    }

    public static resizeToScale(node: Node, worldScale: Vec3, time: number = 0.1, easing: TweenEasing = 'sineOut'): void {       
        const newTween = tween(node).to(time, { worldScale }, { easing });
        if (!node['__activeTweens']) {
            node['__activeTweens'] = [];
        }
        node['__activeTweens'].push(newTween);
        newTween.start();
    }

    public static stopAnimation(node: Node): void{
        if (node['__activeTweens']) {
            for (const activeTween of node['__activeTweens']) {
                activeTween.stop();
            }
            node['__activeTweens'] = [];
        }
    }
}